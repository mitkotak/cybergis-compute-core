export default {
    destinationMap: {
        summa: {
            ip: "keeling.earth.illinois.edu",
            port: 22,
            maintainer: 'SUMMAMaintainer',
            jobPoolCapacity: 5,
            isCommunityAccount: true,
            communityAccountSSH: {
                user: 'cigi-gisolve',
                useLocalKeys: false,
                key: {
                    privateKeyPath: __dirname + '/../key/cigi-gisolve.key',
                    passphrase: null
                }
            }
        },
        // examples
        examplePrivateAccountService: {
            ip: "keeling.earth.illinois.edu",
            port: 22,
            maintainer: 'SUMMAMaintainer',
            jobPoolCapacity: 5,
            isCommunityAccount: false
        },
        exampleCommunityAccountUsingLocalKey: {
            ip: "keeling.earth.illinois.edu",
            port: 22,
            maintainer: 'SUMMAMaintainer',
            jobPoolCapacity: 5,
            isCommunityAccount: true,
            communityAccountSSH: {
                user: 'cigi-gisolve',
                useLocalKeys: true
            }
        }
    }
}