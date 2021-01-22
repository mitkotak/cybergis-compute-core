"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseMaintainer_1 = require("./BaseMaintainer");
var WRFHydroMaintainer = (function (_super) {
    __extends(WRFHydroMaintainer, _super);
    function WRFHydroMaintainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WRFHydroMaintainer.prototype.define = function () {
        this.allowedEnv = {};
    };
    WRFHydroMaintainer.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var machine, node, walltime, username, jobid, partition, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        machine = this.manifest.payload.machine === undefined ? 'keeling' : this.manifest.payload.machine;
                        node = this.manifest.payload.node === undefined ? 16 : this.manifest.payload.node;
                        walltime = this.manifest.payload.walltime === undefined ? 1 : this.manifest.payload.walltime;
                        username = machine === 'keeling' ? 'cigi-gisolve' : 'cybergis';
                        jobid = this.getJobID();
                        partition = this.manifest.payload.partition === undefined ? undefined : this.manifest.payload.partition;
                        return [4, this.runPython('WRFHydro/init.py', [
                                username,
                                __dirname + '/../../key/cigi-gisolve.key',
                                __dirname + '/../../data',
                                'upload/' + this.manifest.uid + '/' + this.manifest.file,
                                machine,
                                node,
                                walltime,
                                jobid,
                                partition,
                            ])];
                    case 1:
                        params = _a.sent();
                        this.machine = machine;
                        this.username = username;
                        this.remote_id = params['remote_id'];
                        this.remote_job_folder_path = params['remote_job_folder_path'];
                        this.local_job_folder_path = params['local_job_folder_path'];
                        return [2];
                }
            });
        });
    };
    WRFHydroMaintainer.prototype.onMaintain = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.runPython('WRFHydro/maintain.py', [
                            this.machine,
                            this.username,
                            __dirname + '/../../key/cigi-gisolve.key',
                            this.remote_id,
                            this.remote_job_folder_path,
                            this.local_job_folder_path
                        ])];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return WRFHydroMaintainer;
}(BaseMaintainer_1.default));
exports.default = WRFHydroMaintainer;
