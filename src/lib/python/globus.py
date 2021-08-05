import os
import sys
import json
import logging
import time
from globus_sdk import GlobusAPIError, NetworkError, NativeAppAuthClient, RefreshTokenAuthorizer, TransferClient, TransferData

logger = logging.getLogger(__name__)
CLIENT_ID = None
TRANSFER_REFRESH_TOKEN = None
SOURCE_ENDPOINT_ID = None
DESTINATION_ENDPOINT_ID = None
SOURCE_PATH = None
DESTINATION_PATH = None
GLOBUS_TASK_LABEL = None

## Setup Globus Connect Personal on JetStream NFS VM
## see: https://docs.globus.org/how-to/globus-connect-personal-linux/
## see: https://globus-sdk-python.readthedocs.io/en/stable/examples/advanced_transfer.html

def retry_globus_function(func, retries=5, func_name="<func>"):
    """
    Define what it means to retry a "Globus Function", some function or
    method which produces Globus SDK errors on failure.
    """

    def actually_retry():
        """
        Helper: run the next retry
        """
        return retry_globus_function(func, retries=(retries - 1), func_name=func_name)

    def check_for_reraise():
        """
        Helper: check if we should reraise an error
                logs an error message on reraise
                must be run inside an exception handler
        """
        if retries < 1:
            logger.error("Retried {} too many times.".format(func_name))
            raise

    try:
        return func()
    except NetworkError:
        # log with exc_info=True to capture a full stacktrace as a
        # debug-level log
        check_for_reraise()
    except GlobusAPIError:
        # again, log with exc_info=True to capture a full stacktrace
        logger.warning(
            ("Globus func {} experienced a network error".format(func_name)),
            exc_info=True,
        )
        check_for_reraise()

    # if we reach this point without returning or erroring, retry
    return actually_retry()


def submit_transfer_with_retries(transfer_client, transfer_data):
    # create a function with no arguments, for our retry handler
    def locally_bound_func():
        return transfer_client.submit_transfer(transfer_data)

    return retry_globus_function(locally_bound_func, func_name="submit_transfer")


client = NativeAppAuthClient(CLIENT_ID)
authorizer = RefreshTokenAuthorizer(TRANSFER_REFRESH_TOKEN, client)
transfer_client = TransferClient(authorizer=authorizer)

transfer_instance = TransferData(transfer_client, SOURCE_ENDPOINT_ID, DESTINATION_ENDPOINT_ID, label=GLOBUS_TASK_LABEL, sync_level="checksum")
transfer_instance.add_item(SOURCE_PATH, DESTINATION_PATH, recursive=True)
transfer_result = submit_transfer_with_retries(GLOBUS_TASK_LABEL, transfer_instance)

GLOBUS_TASK_ID = transfer_result["task_id"]

res = transfer_client.get_task(GLOBUS_TASK_ID)

while True:
    status = res.data["status"]
    if status == 'SUCCEEDED' or status == 'FAILED':
        print('@status=[' + status + ']')
        break
    else:
        time.sleep(1)
        res = transfer_client.get_task(GLOBUS_TASK_ID)
