/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const tips_module_1 = __webpack_require__(5);
const config_1 = __webpack_require__(12);
const general_config_1 = tslib_1.__importDefault(__webpack_require__(61));
const user_module_1 = __webpack_require__(62);
const _database_1 = __webpack_require__(17);
const admin_module_1 = __webpack_require__(68);
const _auth_1 = __webpack_require__(9);
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const schedule_1 = __webpack_require__(74);
const cron_module_1 = __webpack_require__(75);
// import { WinstonLoggerModule } from '@logger-winston';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
                load: [general_config_1.default, auth_config_1.default],
            }),
            _database_1.DatabaseModule,
            user_module_1.UserModule,
            admin_module_1.AdminModule,
            _auth_1.AuthModule,
            schedule_1.ScheduleModule.forRoot(),
            cron_module_1.CronModule,
            tips_module_1.TipsModule,
            // WinstonLoggerModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TipsModule = void 0;
const tslib_1 = __webpack_require__(1);
const tips_controller_1 = __webpack_require__(6);
const tips_service_1 = __webpack_require__(51);
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(7);
const _database_1 = __webpack_require__(17); // Import the module containing UserDatabaseService
const config_1 = __webpack_require__(12);
const general_config_1 = tslib_1.__importDefault(__webpack_require__(61));
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const _auth_1 = __webpack_require__(9);
let TipsModule = class TipsModule {
};
exports.TipsModule = TipsModule;
exports.TipsModule = TipsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                dest: './uploads', // Specify the destination for file uploads
            }),
            config_1.ConfigModule.forFeature(general_config_1.default),
            config_1.ConfigModule.forFeature(auth_config_1.default),
            _database_1.UserDatabaseModule,
            _database_1.DatabaseModule,
            _database_1.AdminDatabaseModule,
            _auth_1.AuthModule,
        ],
        controllers: [tips_controller_1.TipsController],
        providers: [tips_service_1.TipsService, _database_1.UserDatabaseService, _database_1.AdminDatabaseModule],
    })
], TipsModule);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TipsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(7);
const fs = tslib_1.__importStar(__webpack_require__(8));
const _auth_1 = __webpack_require__(9);
const tips_service_1 = __webpack_require__(51);
const dtos_1 = __webpack_require__(58);
let TipsController = class TipsController {
    constructor(newsService) {
        this.newsService = newsService;
    }
    // @UseGuards(JwtAuthGuard)
    async sendNews(file, body) {
        if (!file) {
            throw new Error('File not provided');
        }
        const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
        return await this.newsService.sendNews({
            to: 'all',
            subject: body.subject,
            html: htmlContent,
        });
    }
    async getNewsOrder() {
        return await this.newsService.getNewsOrder();
    }
    async allNews(page, limit, order, status) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return await this.newsService.allNews(pageNumber, limitNumber, order, status);
    }
    async addTips(tipsData, file) {
        let htmlContent;
        if (file) {
            htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
        }
        return await this.newsService.addTips(tipsData, htmlContent);
    }
    async getTips() {
        return await this.newsService.getTips();
    }
    async getTipsById(id, page, limit) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return await this.newsService.getTipsById(parseInt(id, 10), pageNumber, limitNumber);
    }
    async addNews(file, newsData) {
        if (!file) {
            console.error('File not provided');
            throw new Error('File not provided');
        }
        const htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
        return await this.newsService.addNews(newsData, htmlContent);
    }
    async getNews(id, page, limit) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return await this.newsService.getNews(parseInt(id, 10), pageNumber, limitNumber);
    }
    async getNewsById(id) {
        return await this.newsService.getNewsById(parseInt(id, 10));
    }
    async updateNews(id, newsData, file) {
        let htmlContent;
        if (file) {
            htmlContent = fs.readFileSync(file.path, 'utf8'); // Use file.path directly
        }
        return await this.newsService.updateNews(parseInt(id, 10), newsData, htmlContent);
    }
    async deleteNews(id) {
        return await this.newsService.deleteNews(parseInt(id, 10));
    }
};
exports.TipsController = TipsController;
tslib_1.__decorate([
    (0, common_1.Post)('sendnews'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], TipsController.prototype, "sendNews", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('newsorder'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], TipsController.prototype, "getNewsOrder", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('allnews'),
    tslib_1.__param(0, (0, common_1.Query)('page')),
    tslib_1.__param(1, (0, common_1.Query)('limit')),
    tslib_1.__param(2, (0, common_1.Query)('order')),
    tslib_1.__param(3, (0, common_1.Query)('status')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Boolean]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], TipsController.prototype, "allNews", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('tip-add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_h = typeof Express !== "undefined" && (_g = Express.Multer) !== void 0 && _g.File) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TipsController.prototype, "addTips", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('alltips'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], TipsController.prototype, "getTips", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('tip/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)('page')),
    tslib_1.__param(2, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], TipsController.prototype, "getTipsById", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('news/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_m = typeof Express !== "undefined" && (_l = Express.Multer) !== void 0 && _l.File) === "function" ? _m : Object, typeof (_o = typeof dtos_1.CreateAddNewsDto !== "undefined" && dtos_1.CreateAddNewsDto) === "function" ? _o : Object]),
    tslib_1.__metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], TipsController.prototype, "addNews", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('tip/news/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)('page')),
    tslib_1.__param(2, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], TipsController.prototype, "getNews", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('news/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TipsController.prototype, "getNewsById", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')) // <-- Add this line
    ,
    (0, common_1.Post)('news/update/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_r = typeof dtos_1.UpdateNewsDto !== "undefined" && dtos_1.UpdateNewsDto) === "function" ? _r : Object, typeof (_t = typeof Express !== "undefined" && (_s = Express.Multer) !== void 0 && _s.File) === "function" ? _t : Object]),
    tslib_1.__metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], TipsController.prototype, "updateNews", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Delete)('news/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], TipsController.prototype, "deleteNews", null);
exports.TipsController = TipsController = tslib_1.__decorate([
    (0, common_1.Controller)('tips'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof tips_service_1.TipsService !== "undefined" && tips_service_1.TipsService) === "function" ? _a : Object])
], TipsController);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(10), exports);
tslib_1.__exportStar(__webpack_require__(13), exports);
tslib_1.__exportStar(__webpack_require__(16), exports);
tslib_1.__exportStar(__webpack_require__(48), exports);
tslib_1.__exportStar(__webpack_require__(46), exports);
tslib_1.__exportStar(__webpack_require__(50), exports);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(11), exports);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(12);
exports["default"] = (0, config_1.registerAs)('auth', () => ({
    backendURL: process.env['BACKEND_URL'],
    codeValidationTime: process.env['CODE_VALIDATION_TIME'],
    emailConfirmURL: process.env['EMAIL_CONFIRMATION_URL'],
    forgotPasswordURL: process.env['FORGOT_PASSWORD_URL'],
    jwt_secret: process.env['JWT_SECRET'],
    jwt_secret_refresh: process.env['JWT_SECRET_REFRESH'],
    jwt_expired: process.env['JWT_EXPIRED_TIME'],
    jwt_refresh_expired: process.env['JWT_REFRESH_EXPIRED_TIME'],
    differentIpTemplateName: process.env['DIFFERENT_IP_TEMPLATE_NAME'],
    baseTemplateUrl: process.env['BASE_TEMPLATE_URL'],
    admin_email: process.env['ADMIN_EMAIL'],
    static_token_cron_trigger: process.env['STATIC_TOKEN_CRON_TRIGGER'],
}));


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(14);
const passport_1 = __webpack_require__(15);
const auth_service_1 = __webpack_require__(16);
const config_1 = __webpack_require__(12);
const jwt_strategy_1 = __webpack_require__(46);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60m' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(1);
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(14);
const _database_1 = __webpack_require__(17);
const config_1 = __webpack_require__(12);
let AuthService = class AuthService {
    constructor(authCfg, adminDatabaseService, jwtService) {
        this.authCfg = authCfg;
        this.adminDatabaseService = adminDatabaseService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const admin = await this.adminDatabaseService.findOne({ email });
        if (admin && admin.password === pass) {
            const { password, ...result } = admin;
            return result;
        }
        return null;
    }
    async login(email, id) {
        const payload = { email: email, sub: id };
        const options = { secret: this.authCfg.jwt_secret, expiresIn: '1h' };
        return this.jwtService.sign(payload, options);
    }
    async decodeToken(token) {
        try {
            const decoded = await this.jwtService.verify(token, {
                secret: this.authCfg.jwt_secret,
            });
            return decoded;
        }
        catch {
            return false;
        }
    }
    async isTokenStored(token) {
        const tokenRecord = await this.adminDatabaseService.findOne({
            token,
        });
        return !!tokenRecord;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(auth_config_1.default.KEY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof _database_1.AdminDatabaseService !== "undefined" && _database_1.AdminDatabaseService) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(18), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(37), exports);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const admin_database_service_1 = __webpack_require__(20);
const prisma_1 = __webpack_require__(23);
let AdminDatabaseModule = class AdminDatabaseModule {
};
exports.AdminDatabaseModule = AdminDatabaseModule;
exports.AdminDatabaseModule = AdminDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [admin_database_service_1.AdminDatabaseService, prisma_1.PrismaService],
        exports: [admin_database_service_1.AdminDatabaseService],
    })
], AdminDatabaseModule);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let AdminDatabaseService = class AdminDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        return await this.prisma.admin.findMany({
            where: params.where,
        });
    }
    async findByEmail(where) {
        return this.prisma.admin.findFirst({
            where,
        });
    }
    async findOne(where) {
        return this.prisma.admin.findUnique({
            where,
        });
    }
    async create(data) {
        return this.prisma.admin.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.admin.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.prisma.admin.delete({
            where: { id },
        });
    }
};
exports.AdminDatabaseService = AdminDatabaseService;
exports.AdminDatabaseService = AdminDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AdminDatabaseService);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(22);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        exports: [prisma_service_1.PrismaService],
        providers: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const cron_database_service_1 = __webpack_require__(27);
const prisma_1 = __webpack_require__(23);
let CronDatabaseModule = class CronDatabaseModule {
};
exports.CronDatabaseModule = CronDatabaseModule;
exports.CronDatabaseModule = CronDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [cron_database_service_1.CronDatabaseService, prisma_1.PrismaService],
        exports: [cron_database_service_1.CronDatabaseService],
    })
], CronDatabaseModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let CronDatabaseService = class CronDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCron(data) {
        return this.prisma.cron.create({ data });
    }
    async findManyCron() {
        return this.prisma.cron.findMany({
            select: {
                name: true,
                id: true,
                startTime: true,
                schedule: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                lastRun: true,
                nextRun: true,
            },
        });
    }
    async findUniqueCron(where) {
        return this.prisma.cron.findUnique({ where });
    }
    async deleteCron(where) {
        return this.prisma.cron.delete({ where });
    }
    async updateCron(params) {
        return this.prisma.cron.update({ where: params.where, data: params.data });
    }
};
exports.CronDatabaseService = CronDatabaseService;
exports.CronDatabaseService = CronDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CronDatabaseService);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NewsDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const news_database_service_1 = __webpack_require__(30);
const prisma_1 = __webpack_require__(23);
let NewsDatabaseModule = class NewsDatabaseModule {
};
exports.NewsDatabaseModule = NewsDatabaseModule;
exports.NewsDatabaseModule = NewsDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [news_database_service_1.NewsDatabaseService, prisma_1.PrismaService],
        exports: [news_database_service_1.NewsDatabaseService],
    })
], NewsDatabaseModule);
// Compare this snippet from libs/database/src/news/news-database.service.ts:


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NewsDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let NewsDatabaseService = class NewsDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNews(data) {
        return this.prisma.news.create({
            data,
        });
    }
    async findMany(params) {
        const result = await this.prisma.news.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            orderBy: params.orderBy,
            include: params.include,
        });
        return result;
    }
    async findNewsById(id) {
        return this.prisma.news.findUnique({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.news.count({ where });
    }
    async updateNews(id, data) {
        return this.prisma.news.update({
            where: { id },
            data,
        });
    }
    async deleteNews(id) {
        return this.prisma.news.delete({
            where: { id },
        });
    }
    async findFirst(where, orderBy) {
        return this.prisma.news.findFirst({
            where,
        });
    }
};
exports.NewsDatabaseService = NewsDatabaseService;
exports.NewsDatabaseService = NewsDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NewsDatabaseService);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TipsDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const tips_database_service_1 = __webpack_require__(33);
const prisma_1 = __webpack_require__(23);
let TipsDatabaseModule = class TipsDatabaseModule {
};
exports.TipsDatabaseModule = TipsDatabaseModule;
exports.TipsDatabaseModule = TipsDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [tips_database_service_1.TipsDatabaseService, prisma_1.PrismaService],
        exports: [tips_database_service_1.TipsDatabaseService],
    })
], TipsDatabaseModule);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TipsDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let TipsDatabaseService = class TipsDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTips(data) {
        return this.prisma.tips.create({ data });
    }
    async findMany(params) {
        return this.prisma.tips.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            orderBy: params.orderBy,
            select: params.select,
        });
    }
    async findUnique(params) {
        return this.prisma.tips.findUnique(params);
    }
    async deleteTips(where) {
        return this.prisma.tips.delete({ where });
    }
    async update(params) {
        return this.prisma.tips.update({ where: params.where, data: params.data });
    }
    async count(where) {
        return this.prisma.tips.count({ where });
    }
};
exports.TipsDatabaseService = TipsDatabaseService;
exports.TipsDatabaseService = TipsDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TipsDatabaseService);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(35), exports);
tslib_1.__exportStar(__webpack_require__(36), exports);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const user_database_service_1 = __webpack_require__(36);
const prisma_1 = __webpack_require__(23);
let UserDatabaseModule = class UserDatabaseModule {
};
exports.UserDatabaseModule = UserDatabaseModule;
exports.UserDatabaseModule = UserDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [user_database_service_1.UserDatabaseService, prisma_1.PrismaService],
        exports: [user_database_service_1.UserDatabaseService],
    })
], UserDatabaseModule);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(21);
let UserDatabaseService = class UserDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        return await this.prisma.user.findMany({
            where: params.where,
        });
    }
    async findByEmail(where) {
        return this.prisma.user.findUnique({
            where,
        });
    }
    async findOne(where) {
        return this.prisma.user.findUnique({
            where,
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async update(where, data) {
        return this.prisma.user.update({
            where,
            data,
        });
    }
    async delete(id) {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
    async count(params) {
        return this.prisma.user.count({
            where: params.where,
        });
    }
    async findMany(params) {
        return this.prisma.user.findMany({
            where: params.where,
            skip: params.skip,
            take: params.take,
            orderBy: params.orderBy,
        });
    }
};
exports.UserDatabaseService = UserDatabaseService;
exports.UserDatabaseService = UserDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserDatabaseService);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const user_database_module_1 = __webpack_require__(35);
const common_1 = __webpack_require__(2);
const admin_1 = __webpack_require__(18);
const prisma_module_1 = __webpack_require__(24);
const cron_1 = __webpack_require__(25);
const news_1 = __webpack_require__(28);
const tips_1 = __webpack_require__(31);
const logs_1 = __webpack_require__(38);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            user_database_module_1.UserDatabaseModule,
            admin_1.AdminDatabaseModule,
            prisma_module_1.PrismaModule,
            cron_1.CronDatabaseModule,
            news_1.NewsDatabaseModule,
            tips_1.TipsDatabaseModule,
            logs_1.LogsDatabaseModule,
        ],
        providers: [prisma_module_1.PrismaModule],
        exports: [
            user_database_module_1.UserDatabaseModule,
            admin_1.AdminDatabaseModule,
            prisma_module_1.PrismaModule,
            cron_1.CronDatabaseModule,
            news_1.NewsDatabaseModule,
            tips_1.TipsDatabaseModule,
            logs_1.LogsDatabaseModule,
        ],
    })
], DatabaseModule);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(39), exports);
tslib_1.__exportStar(__webpack_require__(40), exports);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsDatabaseModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const logs_database_service_1 = __webpack_require__(40);
const prisma_1 = __webpack_require__(23);
let LogsDatabaseModule = class LogsDatabaseModule {
};
exports.LogsDatabaseModule = LogsDatabaseModule;
exports.LogsDatabaseModule = LogsDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [logs_database_service_1.LogsDatabaseService, prisma_1.PrismaService],
        exports: [logs_database_service_1.LogsDatabaseService],
    })
], LogsDatabaseModule);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsDatabaseService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const prisma_1 = __webpack_require__(23);
const client_1 = __webpack_require__(22);
const _utils_1 = __webpack_require__(41);
let LogsDatabaseService = class LogsDatabaseService {
    constructor(prisma) {
        this.prisma = prisma;
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            fatal: 4,
        };
        // Default service name
        this.service = 'default-service';
        // Default to 'info' log level
        this.setLogLevel('info');
    }
    /**
     * Set the minimum log level dynamically
     * @param level The log level to set
     */
    setLogLevel(level) {
        this.minLevel = this.levels[level] ?? this.levels['info'];
    }
    /**
     * Get the current log level
     */
    getLogLevel() {
        const levelEntry = Object.entries(this.levels).find(([, value]) => value === this.minLevel);
        return levelEntry?.[0] || 'info';
    }
    /**
     * Set the service name
     * @param serviceName The service name to set
     */
    setServiceName(serviceName) {
        this.service = serviceName;
    }
    async log(message, context, metadata) {
        if (this.levels.info < this.minLevel)
            return;
        await this.writeLog('INFO', message, context, metadata);
    }
    async warn(message, context, metadata) {
        if (this.levels.warn < this.minLevel)
            return;
        await this.writeLog('WARN', message, context, metadata);
    }
    async error(message, context, metadata) {
        if (this.levels.error < this.minLevel)
            return;
        await this.writeLog('ERROR', message, context, metadata);
    }
    async debug(message, context, metadata) {
        if (this.levels.debug < this.minLevel)
            return;
        await this.writeLog('DEBUG', message, context, metadata);
    }
    async writeLog(level, message, context, metadata) {
        try {
            // Generate a unique trace ID
            const traceId = (0, _utils_1.generateTraceId)();
            // Store in database
            await this.prisma.log.create({
                data: {
                    level,
                    message,
                    context,
                    metadata: metadata ? JSON.stringify(metadata) : client_1.Prisma.JsonNull,
                    service: this.service,
                    traceId,
                    timestamp: new Date(),
                },
            });
        }
        catch (error) {
            console.error('Failed to write log to PostgreSQL', error instanceof Error ? error.message : error);
        }
    }
    /**
     * Batch log multiple messages at once for better performance
     */
    async batchLog(logs) {
        try {
            // Filter logs based on minimum log level
            const filteredLogs = logs.filter((log) => this.levels[log.level] >= this.minLevel);
            if (filteredLogs.length === 0)
                return;
            // Create data array for prisma createMany
            const data = filteredLogs.map((log) => {
                const traceId = (0, _utils_1.generateTraceId)();
                const service = log.service || this.service; // Use the instance's service name
                return {
                    level: log.level.toUpperCase(),
                    message: log.message,
                    context: log.context,
                    metadata: log.metadata
                        ? JSON.stringify(log.metadata)
                        : client_1.Prisma.JsonNull,
                    service,
                    traceId,
                    timestamp: new Date(),
                };
            });
            // Batch insert logs
            await this.prisma.log.createMany({
                data,
            });
        }
        catch (error) {
            console.error('Failed to batch write logs to PostgreSQL', error instanceof Error ? error.message : error);
        }
    }
    /**
     * Clean up old logs to prevent database from growing too large
     * @param days Number of days of logs to keep
     */
    async cleanupOldLogs(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const result = await this.prisma.log.deleteMany({
                where: {
                    timestamp: {
                        lt: cutoffDate,
                    },
                },
            });
            console.log(`Cleaned up ${result.count} old log entries`);
            return result.count;
        }
        catch (error) {
            console.error('Failed to clean up old logs', error instanceof Error ? error.message : error);
            return 0;
        }
    }
};
exports.LogsDatabaseService = LogsDatabaseService;
exports.LogsDatabaseService = LogsDatabaseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_1.PrismaService !== "undefined" && prisma_1.PrismaService) === "function" ? _a : Object])
], LogsDatabaseService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(42), exports);
tslib_1.__exportStar(__webpack_require__(43), exports);
tslib_1.__exportStar(__webpack_require__(45), exports);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fetchWithAuth = fetchWithAuth;
async function fetchWithAuth(url, options, includeToken = true) {
    try {
        const token = localStorage.getItem('token');
        if (!token && includeToken) {
            throw new Error('No token found');
        }
        const headers = new Headers(options.headers);
        if (includeToken && token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        if (!(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }
        url = `${process.env.BACKEND_URL}${url}`;
        options = {
            ...options,
            headers,
            mode: 'cors',
        };
        console.log("fetchWithAuth' request:", {
            url,
            headers,
            options,
        });
        const response = await fetch(url, options);
        if (!response.ok) {
            console.error('Request failed:', {
                url,
                headers,
                body: options.body,
                status: response.status,
                statusText: response.statusText,
            });
        }
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }
        return data;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('Unknown error');
        }
    }
}


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateTraceId = void 0;
const uuid_1 = __webpack_require__(44);
const generateTraceId = (service = 'app' // Added default parameter
) => {
    // Generate a UUID v4 for better compatibility and uniqueness
    return (0, uuid_1.v4)();
};
exports.generateTraceId = generateTraceId;


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeCalculator = void 0;
exports.getCronExpression = getCronExpression;
const TimeCalculator = (schedule, startDateTime) => {
    switch (schedule) {
        case 'every_5_minutes':
            return new Date(startDateTime.getTime() + 5 * 60 * 1000); // Add 5 minutes to the start time
        case 'every_10_minutes':
            return new Date(startDateTime.getTime() + 10 * 60 * 1000); // Add 10 minutes to the start time
        case 'every_minute':
            return new Date(startDateTime.getTime() + 1 * 60 * 1000); // Add 1 minute to the start time
        case 'every_day':
            return new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000); // Add one day to the start time
        case 'every_week':
            return new Date(startDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Add one week to the start time
        case 'every_month': {
            const nextMonth = new Date(startDateTime);
            nextMonth.setMonth(nextMonth.getMonth() + 1); // Add one month to the start time
            return nextMonth;
        }
        case 'every_year': {
            const nextYear = new Date(startDateTime);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            return nextYear;
        }
        default:
            throw new Error('Invalid schedule type');
    }
};
exports.TimeCalculator = TimeCalculator;
/**
 * Generates a cron expression based on schedule key and startTime.
 * For "every-day", "every-week", "every-month", "every-year", uses startTime's hour/minute.
 * For interval-based (every-5-minutes, etc.), uses the enum value directly.
 */
function getCronExpression(schedule, startTime) {
    switch (schedule) {
        case 'every_day':
            // Run every day at the hour/minute of startTime
            return `${startTime.getMinutes()} ${startTime.getHours()} * * *`;
        case 'every_week':
            // Run every week at the hour/minute/day of week of startTime
            return `${startTime.getMinutes()} ${startTime.getHours()} * * ${startTime.getDay()}`;
        case 'every_month':
            // Run every month at the hour/minute/day of month of startTime
            return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} * *`;
        case 'every_year':
            // Run every year at the hour/minute/day/month of startTime
            return `${startTime.getMinutes()} ${startTime.getHours()} ${startTime.getDate()} ${startTime.getMonth() + 1} *`;
        case 'every_5_minutes':
            return '*/5 * * * *'; // Adjust as needed for your cron library
        case 'every_10_minutes':
            return '*/10 * * * *'; // Adjust as needed for your cron library
        case 'every_minute':
            return '*/1 * * * *'; // Adjust as needed for your cron library
        default:
            throw new Error(`Unsupported schedule key: ${schedule}`);
    }
}


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const passport_jwt_1 = __webpack_require__(47);
const config_1 = __webpack_require__(12);
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authCfg) {
        const jwtSecret = authCfg.jwt_secret;
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.authCfg = authCfg;
    }
    async validate(payload) {
        if (!payload) {
            throw new common_1.UnauthorizedException('JWT payload is missing');
        }
        if (!payload.sub) {
            throw new common_1.UnauthorizedException('JWT payload is missing the "sub" field');
        }
        if (!payload.email) {
            throw new common_1.UnauthorizedException('JWT payload is missing the "email" field');
        }
        return { userId: payload.sub, email: payload.email };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(auth_config_1.default.KEY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(1);
// jwt-auth.guard.ts
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(15);
const core_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(16);
const rxjs_1 = __webpack_require__(49);
const config_1 = __webpack_require__(12);
const auth_mode_decorator_1 = __webpack_require__(50);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService, reflector, configService) {
        super();
        this.authService = authService;
        this.reflector = reflector;
        this.configService = configService;
        this.staticToken = this.configService.get('STATIC_AUTH_TOKEN');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(request);
        const authMode = this.reflector.get(auth_mode_decorator_1.AUTH_MODE_KEY, context.getHandler()) || 'jwt';
        if (!token) {
            throw new common_1.UnauthorizedException('Authorization token not found');
        }
        if (authMode === 'static') {
            if (this.staticToken && token === this.staticToken) {
                return true;
            }
            else {
                throw new common_1.UnauthorizedException('Static token not valid');
            }
        }
        if (authMode === 'jwt') {
            const isTokenValid = await this.authService.isTokenStored(token);
            if (!isTokenValid) {
                throw new common_1.UnauthorizedException('JWT token not stored in DB');
            }
            const result = super.canActivate(context);
            if (result instanceof Promise) {
                return result;
            }
            else if (result instanceof rxjs_1.Observable) {
                return result ? (await result.toPromise()) ?? false : false;
            }
            else {
                return result;
            }
        }
        return false;
    }
    extractTokenFromRequest(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return null;
        const [bearer, token] = authHeader.split(' ');
        return bearer === 'Bearer' ? token : null;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], JwtAuthGuard);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthMode = exports.AUTH_MODE_KEY = void 0;
// auth-mode.decorator.ts
const common_1 = __webpack_require__(2);
exports.AUTH_MODE_KEY = 'authMode';
const AuthMode = (mode) => (0, common_1.SetMetadata)(exports.AUTH_MODE_KEY, 'static');
exports.AuthMode = AuthMode;


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TipsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const nodemailer_1 = __webpack_require__(52);
const _database_1 = __webpack_require__(17);
const logs_1 = __webpack_require__(38);
let TipsService = class TipsService {
    constructor(userDatabaseService, newsDatabaseService, tipsDatabaseService, logger) {
        this.userDatabaseService = userDatabaseService;
        this.newsDatabaseService = newsDatabaseService;
        this.tipsDatabaseService = tipsDatabaseService;
        this.logger = logger;
        if (process.env.NODE_ENV === 'production') {
            logger.setLogLevel('error'); // Only log errors in production
        }
        else {
            logger.setLogLevel('debug'); // Log everything in development
        }
        logger.setServiceName('admin-service');
    }
    async sendNews(emailData) {
        try {
            const users = await this.userDatabaseService.findAll({
                where: { subscription: true },
            });
            if (users.length === 0) {
                throw new common_1.HttpException('No users to send email to', common_1.HttpStatus.NOT_FOUND);
            }
            const { sentUsers, errorUsers } = await (0, nodemailer_1.sendEmailAzure)(users, emailData.subject, emailData.html);
            // const { sentUsers, errorUsers } = await sendEmailsGmail(
            //   users,
            //   emailData.subject,
            //   emailData.html
            // );
            return {
                data: { sentUsers, errorUsers },
                success: true,
                message: 'Email sent successfully',
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to send email', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNewsOrder() {
        const data = await this.newsDatabaseService.findMany({
            where: { status: true },
            orderBy: { createdAt: 'asc' },
            include: {
                tips: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        return {
            data,
            success: true,
            message: 'Emails retrieved successfully',
        };
    }
    async allNews(page, limit, order, status) {
        const where = {};
        const skip = page * limit;
        const take = limit;
        if (status !== undefined) {
            where.status = status;
        }
        if (!page || !limit) {
            const emails = await this.newsDatabaseService.findMany({
                where,
                orderBy: { createdAt: 'asc' },
            });
            const total = await this.newsDatabaseService.count(where);
            return { success: true, message: '', data: { emails, total } };
        }
        // const orderBy: Prisma.NewsOrderByWithRelationInput;
        const emails = await this.newsDatabaseService.findMany({
            orderBy: { createdAt: 'asc' },
            where,
        });
        const total = await this.newsDatabaseService.count(where);
        return {
            data: { emails, total },
            success: true,
            message: 'Emails retrieved successfully',
        };
    }
    async addNews(newsData, html) {
        try {
            const tips = await this.tipsDatabaseService.findUnique({
                where: { id: parseInt(newsData.tipsId) },
            });
            if (!tips) {
                throw new common_1.HttpException('Tips not found', common_1.HttpStatus.NOT_FOUND);
            }
            const emailStatus = newsData.status === 'true' ? true : false;
            const data = await this.newsDatabaseService.createNews({
                title: newsData.title,
                content: html,
                status: emailStatus,
                tips: {
                    connect: {
                        id: parseInt(newsData.tipsId),
                    },
                },
            });
            return { message: 'News added successfully', success: true, data };
        }
        catch (error) {
            // Handle error
            console.error('Error adding news:', error);
            throw new common_1.HttpException('Failed to add news', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNews(id, page, limit) {
        try {
            const news = await this.newsDatabaseService.findMany({
                where: { tipsId: id },
                take: limit,
                skip: (page - 1) * limit,
            });
            const total = await this.newsDatabaseService.count({ tipsId: id });
            return {
                data: { news, total },
                message: 'News fetched successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to fetch news', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNewsById(id) {
        try {
            const news = await this.newsDatabaseService.findNewsById(id);
            return {
                data: news,
                message: 'News fetched successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to fetch news', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateNews(id, newsData, file) {
        try {
            console.log('datalar', newsData, id);
            const news = await this.newsDatabaseService.findNewsById(id);
            if (!news) {
                throw new common_1.HttpException('News not found', common_1.HttpStatus.NOT_FOUND);
            }
            const tips = await this.tipsDatabaseService.findUnique({
                where: { id: news.tipsId },
            });
            if (!tips) {
                throw new common_1.HttpException('Tips not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (newsData.status !== undefined &&
                newsData.status !== 'true' &&
                newsData.status !== 'false') {
                throw new common_1.HttpException('Invalid status', common_1.HttpStatus.BAD_REQUEST);
            }
            const emailStatus = newsData.status === 'true' ? true : false;
            const data = {
                status: emailStatus,
            };
            if (newsData.title !== undefined) {
                data.title = newsData.title;
            }
            if (file) {
                data.content = file;
            }
            const updatedNews = await this.newsDatabaseService.updateNews(id, data);
            if (!updatedNews) {
                throw new common_1.HttpException('Failed to update news', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'News updated successfully',
                success: true,
                data: updatedNews,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to update news', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteNews(id) {
        try {
            const news = await this.newsDatabaseService.deleteNews(id);
            return {
                data: news,
                message: 'News deleted successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to delete news', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addTips(tipsData, html) {
        try {
            const tips = await this.tipsDatabaseService.findMany({
                where: { title: tipsData.title },
            });
            if (tips.length > 0) {
                // Tips already exist
                throw new common_1.HttpException('Tips already exists', common_1.HttpStatus.CONFLICT);
            }
            const data = {
                title: tipsData.title,
                description: tipsData.description,
            };
            console.log('html', html);
            if (html) {
                data.news = {
                    create: {
                        title: tipsData.title,
                        content: html,
                    },
                };
            }
            const response = await this.tipsDatabaseService.createTips(data);
            if (!response) {
                throw new common_1.HttpException('Failed to add tips', common_1.HttpStatus.BAD_REQUEST);
            }
            return { message: 'Tips added successfully', success: true };
        }
        catch (error) {
            if (error) {
                throw new common_1.HttpException(error.response, error.status);
            }
            // Handle error
            throw new common_1.HttpException('Failed to add tips', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTips() {
        try {
            const tips = await this.tipsDatabaseService.findMany({});
            return {
                data: {
                    tips: tips,
                    total: tips.length,
                },
                message: 'Tips fetched successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to fetch tips', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTipsById(id, page, limit) {
        const select = {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            news: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    status: true,
                },
            },
        };
        try {
            if (!page || !limit) {
                const tips = await this.tipsDatabaseService.findMany({
                    where: {
                        id: id,
                    },
                    select,
                });
                const total = await this.newsDatabaseService.count({ tipsId: id });
                return { success: true, message: '', data: { ...tips[0], total } };
            }
            if (page || limit) {
                const skip = (page - 1) * limit;
                const take = limit;
                select.news = {
                    take,
                    skip,
                };
            }
            const tip = await this.tipsDatabaseService.findMany({
                where: {
                    id: id,
                },
                select,
            });
            if (!tip) {
                throw new common_1.HttpException('Tips not found', common_1.HttpStatus.NOT_FOUND);
            }
            console.log('tip', tip);
            const total = await this.newsDatabaseService.count({ tipsId: id });
            return {
                data: { ...(Array.isArray(tip) ? tip[0] : tip), total },
                message: 'Tips fetched successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to fetch tips', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TipsService = TipsService;
exports.TipsService = TipsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof _database_1.UserDatabaseService !== "undefined" && _database_1.UserDatabaseService) === "function" ? _a : Object, typeof (_b = typeof _database_1.NewsDatabaseService !== "undefined" && _database_1.NewsDatabaseService) === "function" ? _b : Object, typeof (_c = typeof _database_1.TipsDatabaseService !== "undefined" && _database_1.TipsDatabaseService) === "function" ? _c : Object, typeof (_d = typeof logs_1.LogsDatabaseService !== "undefined" && logs_1.LogsDatabaseService) === "function" ? _d : Object])
], TipsService);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(53), exports);
tslib_1.__exportStar(__webpack_require__(56), exports);


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendEmailAzure = void 0;
const tslib_1 = __webpack_require__(1);
// filepath: /d:/GithubProjects/ecopote/libs/shared/nodemailer/azuremailer.ts
const communication_email_1 = __webpack_require__(54);
const dotenv_1 = tslib_1.__importDefault(__webpack_require__(55));
dotenv_1.default.config();
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not defined');
}
const emailClient = new communication_email_1.EmailClient(connectionString);
const sendEmailAzure = async (to, subject, htmlContent) => {
    const sentUsers = [];
    const errorUsers = [];
    const emailMessage = {
        senderAddress: process.env.SENDER_EMAIL_ADDRESS || '',
        content: {
            subject: subject,
            plainText: '',
            html: htmlContent,
        },
        recipients: {
            to: to.map((user) => ({ address: user.email, displayName: user.email })),
        },
    };
    try {
        const poller = await emailClient.beginSend(emailMessage);
        const response = await poller.pollUntilDone();
        console.log('Email sent:', response);
        if (response.status === 'Succeeded') {
            sentUsers.push(...to.map((user) => user.email));
        }
        else {
            errorUsers.push(...to.map((user) => user.email));
        }
        return { sentUsers, errorUsers };
    }
    catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};
exports.sendEmailAzure = sendEmailAzure;


/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("@azure/communication-email");

/***/ }),
/* 55 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendEmailsGmail = exports.sendEmail = void 0;
const tslib_1 = __webpack_require__(1);
const nodemailer_1 = tslib_1.__importDefault(__webpack_require__(57));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST_GMAIL, // Replace with your SMTP server
    port: process.env.MAIL_PORT_GMAIL ? parseInt(process.env.MAIL_PORT) : 587,
    // secure: true,
    auth: {
        user: process.env.MAIL_USER_GMAIL, // Replace with your email
        pass: process.env.MAIL_PASSWORD_GMAIL, // Replace with your email password
    },
});
const sendEmail = async (user, subject, html, sentUsers, errorUsers) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER_GMAIL, // Sender address
            to: user.email, // Recipient address
            subject: subject || 'Mon Eco pote', // Subject line
            html: html, // Plain html body
        });
        console.log(`Email sent to ${user.email}: ${info.messageId}`);
        sentUsers.push(user.email);
    }
    catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        errorUsers.push(user.email);
    }
};
exports.sendEmail = sendEmail;
// Main function to send emails
const sendEmailsGmail = async (users, subject, html) => {
    const BATCH_SIZE = 100; // Adjust the batch size as needed
    const sentUsers = [];
    const errorUsers = [];
    const sendEmailBatch = async (batch) => {
        const promises = batch.map((user) => (0, exports.sendEmail)(user, subject, html, sentUsers, errorUsers));
        await Promise.all(promises);
    };
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        await sendEmailBatch(batch);
        // Rate limiting to avoid getting blocked
        await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    }
    console.log('Sent Users:', sentUsers);
    console.log('Error Users:', errorUsers);
    return { sentUsers, errorUsers };
};
exports.sendEmailsGmail = sendEmailsGmail;


/***/ }),
/* 57 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(59), exports);


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAddNewsDto = exports.UpdateNewsDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(60);
class UpdateNewsDto {
}
exports.UpdateNewsDto = UpdateNewsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateNewsDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateNewsDto.prototype, "status", void 0);
class CreateAddNewsDto {
}
exports.CreateAddNewsDto = CreateAddNewsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAddNewsDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAddNewsDto.prototype, "tipsId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAddNewsDto.prototype, "status", void 0);


/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(12);
exports["default"] = (0, config_1.registerAs)('general', () => ({
    database_host: process.env.DATABASE_HOST,
    database_port: process.env.DATABASE_PORT,
    database_username: process.env.DATABASE_USERNAME,
    database_password: process.env.DATABASE_PASSWORD,
    database_name: process.env.DATABASE_NAME,
    database_url: process.env.DATABASE_URL,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    admin_Email: process.env.ADMIN_EMAIL,
    nonce: process.env.NONCE,
}));


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const user_controller_1 = __webpack_require__(63);
const user_service_1 = __webpack_require__(64);
const _database_1 = __webpack_require__(17);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [_database_1.UserDatabaseModule, _database_1.DatabaseModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, _database_1.UserDatabaseService],
    })
], UserModule);


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(64);
const user_dtos_1 = __webpack_require__(65);
const dtos_1 = __webpack_require__(66);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    // @Get()
    // async findAll() {
    //   return this.userService.findAll();
    // }
    async register(data) {
        return await this.userService.register({
            email: data.email,
            name: data.name,
            subscription: data.subscription ?? true,
        });
    }
    async unregister(data) {
        return await this.userService.unregister({
            email: data.email,
        });
    }
    async update(id, data) {
        return this.userService.update(Number(id), data);
    }
    async delete(id) {
        return this.userService.delete(Number(id));
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof dtos_1.CreateUserDto !== "undefined" && dtos_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('unregister'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof user_dtos_1.UnregisterUserDto !== "undefined" && user_dtos_1.UnregisterUserDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], UserController.prototype, "unregister", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const _database_1 = __webpack_require__(17);
let UserService = class UserService {
    constructor(userDatabaseService) {
        this.userDatabaseService = userDatabaseService;
    }
    async register(data) {
        const user = await this.userDatabaseService.findAll({
            where: { email: data.email },
        });
        if (user[0]) {
            await this.userDatabaseService.update({ id: user[0].id }, { subscription: true });
            return user[0];
        }
        return this.userDatabaseService.create(data);
    }
    async unregister(data) {
        const user = await this.userDatabaseService.findOne({
            email: data.email,
            subscription: true,
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const updatedUser = await this.userDatabaseService.update({ id: user.id }, { subscription: false });
        return {
            message: 'User successfully unregistered',
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                subscription: updatedUser.subscription,
            },
        };
    }
    async update(id, data) {
        return await this.userDatabaseService.update({ id }, data);
    }
    async delete(id) {
        return await this.userDatabaseService.delete(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof _database_1.UserDatabaseService !== "undefined" && _database_1.UserDatabaseService) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = exports.UnregisterUserDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(60);
class UnregisterUserDto {
}
exports.UnregisterUserDto = UnregisterUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'The email field must contain a valid email address.' }),
    tslib_1.__metadata("design:type", String)
], UnregisterUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], UnregisterUserDto.prototype, "subscription", void 0);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Ooops You forgot the ID' }),
    tslib_1.__metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateUserDto.prototype, "subscription", void 0);


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(67), exports);


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronCreateDto = exports.CronTimeSetEnum = exports.ScheduleFrontEnum = exports.CreateUserDto = exports.CronUpdateDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(60);
class CronUpdateDto {
}
exports.CronUpdateDto = CronUpdateDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CronUpdateDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CronUpdateDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CronUpdateDto.prototype, "cronTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CronUpdateDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], CronUpdateDto.prototype, "schedule", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CronUpdateDto.prototype, "status", void 0);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'The email field must contain a valid email address.' }),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'The name field cannot be empty.' }),
    (0, class_validator_1.IsString)({ message: 'The name field must be a string.' }),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateUserDto.prototype, "subscription", void 0);
var ScheduleFrontEnum;
(function (ScheduleFrontEnum) {
    ScheduleFrontEnum["every_week"] = "Every Week";
    ScheduleFrontEnum["every_month"] = "Every Month";
    ScheduleFrontEnum["every_day"] = "Every Day";
    ScheduleFrontEnum["every_year"] = "Every Year";
    // For Testing
    ScheduleFrontEnum["every_5_minutes"] = "Every 5 Minutes";
    ScheduleFrontEnum["every_10_minutes"] = "Every 10 Minutes";
    ScheduleFrontEnum["every_minute"] = "Every Minute";
})(ScheduleFrontEnum || (exports.ScheduleFrontEnum = ScheduleFrontEnum = {}));
var CronTimeSetEnum;
(function (CronTimeSetEnum) {
    CronTimeSetEnum["every_week"] = "0 0 * * 0";
    CronTimeSetEnum["every_day"] = "0 0 * * *";
    CronTimeSetEnum["every_month"] = "0 0 1 * *";
    CronTimeSetEnum["every_year"] = "0 0 1 1 *";
    // For Testing
    CronTimeSetEnum["every_5_minutes"] = "*/5 * * * *";
    CronTimeSetEnum["every_10_minutes"] = "*/10 * * * *";
    CronTimeSetEnum["every_minute"] = "*/1 * * * *";
})(CronTimeSetEnum || (exports.CronTimeSetEnum = CronTimeSetEnum = {}));
class CronCreateDto {
}
exports.CronCreateDto = CronCreateDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CronCreateDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CronCreateDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(ScheduleFrontEnum),
    tslib_1.__metadata("design:type", Object)
], CronCreateDto.prototype, "schedule", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Boolean)
], CronCreateDto.prototype, "status", void 0);


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(7);
const admin_controller_1 = __webpack_require__(69);
const admin_service_1 = __webpack_require__(70);
const _database_1 = __webpack_require__(17); // Import the module containing UserDatabaseService
const config_1 = __webpack_require__(12);
const general_config_1 = tslib_1.__importDefault(__webpack_require__(61));
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const _auth_1 = __webpack_require__(9);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                dest: './uploads', // Specify the destination for file uploads
            }),
            config_1.ConfigModule.forFeature(general_config_1.default),
            config_1.ConfigModule.forFeature(auth_config_1.default),
            _database_1.UserDatabaseModule,
            _database_1.DatabaseModule,
            _database_1.AdminDatabaseModule,
            _auth_1.AuthModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_service_1.AdminService,
            _database_1.UserDatabaseService,
            _database_1.AdminDatabaseModule,
            // WinstonLoggerService,
        ],
    })
], AdminModule);


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const admin_service_1 = __webpack_require__(70);
const _auth_1 = __webpack_require__(9);
const dto_1 = __webpack_require__(72);
const dtos_1 = __webpack_require__(66);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async test() {
        console.log('Test endpoint hit!', new Date().toISOString());
        return 'Test endpoint is working!';
    }
    async createAdmin(createAdminData) {
        return this.adminService.addAdmin(createAdminData);
    }
    async login(credentials) {
        return await this.adminService.login(credentials);
    }
    async logout(token) {
        return await this.adminService.logout(token);
    }
    async createUser(userData) {
        return await this.adminService.addUser(userData);
    }
    async deleteUser(id) {
        return await this.adminService.removeUser(id);
    }
    async getAllUsers(page, limit) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return await this.adminService.listUsers(pageNumber, limitNumber);
    }
    async toggleSubscription(id) {
        return await this.adminService.toggleSubscription(parseInt(id, 10));
    }
};
exports.AdminController = AdminController;
tslib_1.__decorate([
    (0, common_1.Post)('test'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AdminController.prototype, "test", null);
tslib_1.__decorate([
    (0, common_1.Post)('create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof dto_1.CreateAdminDto !== "undefined" && dto_1.CreateAdminDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AdminController.prototype, "createAdmin", null);
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AdminController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('logout'),
    tslib_1.__param(0, (0, common_1.Headers)('Authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AdminController.prototype, "logout", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('create-user'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_g = typeof dtos_1.CreateUserDto !== "undefined" && dtos_1.CreateUserDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], AdminController.prototype, "createUser", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Delete)('users/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], AdminController.prototype, "deleteUser", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('users'),
    tslib_1.__param(0, (0, common_1.Query)('page')),
    tslib_1.__param(1, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], AdminController.prototype, "getAllUsers", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('users/:id/toggle-subscription'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], AdminController.prototype, "toggleSubscription", null);
exports.AdminController = AdminController = tslib_1.__decorate([
    (0, common_1.Controller)('admin'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const _database_1 = __webpack_require__(17);
const general_config_1 = tslib_1.__importDefault(__webpack_require__(61));
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const config_1 = __webpack_require__(12);
const bcrypt = tslib_1.__importStar(__webpack_require__(71));
const auth_service_1 = __webpack_require__(16);
const client_1 = __webpack_require__(22);
let AdminService = class AdminService {
    constructor(adminDatabaseService, generalCfg, authCfg, userDatabaseService, authService // private readonly logger: WinstonLoggerService
    ) {
        this.adminDatabaseService = adminDatabaseService;
        this.generalCfg = generalCfg;
        this.authCfg = authCfg;
        this.userDatabaseService = userDatabaseService;
        this.authService = authService;
        // this.logger.serviceName('admin-service');
    }
    async addAdmin(adminData) {
        try {
            if (adminData.email !== this.generalCfg.admin_Email) {
                throw new common_1.HttpException('Only can be One admin', common_1.HttpStatus.UNAUTHORIZED);
            }
            const admin = await this.adminDatabaseService.findByEmail({
                email: adminData.email,
            });
            if (admin) {
                throw new common_1.HttpException('Admin already exists', common_1.HttpStatus.CONFLICT);
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
            adminData.password = hashedPassword;
            return this.adminDatabaseService.create(adminData);
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to add admin', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(credentials) {
        try {
            const admin = await this.adminDatabaseService.findByEmail({
                email: credentials.email,
            });
            const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.UNAUTHORIZED);
            }
            const token = await this.authService.login(admin.email, admin.id);
            await this.adminDatabaseService.update(admin.id, { token });
            return {
                data: { token },
                success: true,
                message: 'Logged in successfully',
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Login failed', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async logout(token) {
        try {
            const tokenWithoutBearer = token.replace('Bearer ', '');
            const decodedToken = await this.authService.decodeToken(tokenWithoutBearer);
            if (!decodedToken) {
                throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
            }
            const user = await this.adminDatabaseService.findOne({
                id: decodedToken.sub,
                token: tokenWithoutBearer,
            });
            if (!user) {
                throw new common_1.HttpException('Token not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.adminDatabaseService.update(user.id, {
                token: null,
            });
            return { success: true, message: 'Logged out successfully' };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Logout failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addUser(userData) {
        try {
            const user = await this.userDatabaseService.findByEmail({
                email: userData.email,
            });
            if (user) {
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
            }
            const res = await this.userDatabaseService.create({
                ...userData,
                subscription: userData.subscription ?? false,
            });
            if (!res) {
                throw new common_1.HttpException('Failed to add user', common_1.HttpStatus.BAD_REQUEST);
            }
            return { message: 'User added successfully', success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // Unique constraint failed
                    throw new common_1.HttpException('User with this email already exists', common_1.HttpStatus.CONFLICT);
                }
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to add user catch', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeUser(id) {
        try {
            const res = await this.userDatabaseService.delete(id);
            return { message: `${res.email} deleted successfully`, success: true };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to remove user', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async listUsers(page, limit) {
        try {
            if (!page || !limit) {
                const users = await this.userDatabaseService.findMany({});
                const total = await this.userDatabaseService.count({});
                return { success: true, message: '', data: { users, total } };
            }
            const skip = (page - 1) * limit;
            const take = limit;
            const [users, total] = await Promise.all([
                this.userDatabaseService.findMany({
                    take,
                    skip,
                }),
                this.userDatabaseService.count({}),
            ]);
            return { success: true, message: '', data: { users, total } };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to list users', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async toggleSubscription(userId) {
        try {
            const user = await this.userDatabaseService.findOne({ id: userId });
            const userUpdated = await this.userDatabaseService.update({ id: userId }, { subscription: !user.subscription });
            return {
                data: userUpdated,
                message: 'User updated successfully',
                success: true,
            };
        }
        catch (error) {
            // Handle error
            throw new common_1.HttpException('Failed to toggle subscription', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, common_1.Inject)(general_config_1.default.KEY)),
    tslib_1.__param(2, (0, common_1.Inject)(auth_config_1.default.KEY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof _database_1.AdminDatabaseService !== "undefined" && _database_1.AdminDatabaseService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _c : Object, typeof (_d = typeof _database_1.UserDatabaseService !== "undefined" && _database_1.UserDatabaseService) === "function" ? _d : Object, typeof (_e = typeof auth_service_1.AuthService // private readonly logger: WinstonLoggerService
         !== "undefined" && auth_service_1.AuthService // private readonly logger: WinstonLoggerService
        ) === "function" ? _e : Object])
], AdminService);


/***/ }),
/* 71 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(73), exports);


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendEmailDto = exports.LoginAdminDto = exports.UpdateAdminDto = exports.CreateAdminDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(60);
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
class UpdateAdminDto {
}
exports.UpdateAdminDto = UpdateAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "email", void 0);
class LoginAdminDto {
}
exports.LoginAdminDto = LoginAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginAdminDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginAdminDto.prototype, "password", void 0);
class SendEmailDto {
}
exports.SendEmailDto = SendEmailDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SendEmailDto.prototype, "to", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SendEmailDto.prototype, "html", void 0);


/***/ }),
/* 74 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const cron_service_1 = __webpack_require__(76);
const cron_controller_1 = __webpack_require__(77);
const _auth_1 = __webpack_require__(9);
// import { TaskService } from './task.service';
let CronModule = class CronModule {
};
exports.CronModule = CronModule;
exports.CronModule = CronModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [_auth_1.AuthModule],
        controllers: [cron_controller_1.CronController],
        providers: [cron_service_1.CronService],
    })
], CronModule);


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const tslib_1 = __webpack_require__(1);
const _utils_1 = __webpack_require__(41);
const common_1 = __webpack_require__(2);
const _database_1 = __webpack_require__(17);
const nodemailer_1 = __webpack_require__(52);
const auth_config_1 = tslib_1.__importDefault(__webpack_require__(11));
const config_1 = __webpack_require__(12);
let CronService = class CronService {
    // private readonly logger = new Logger(CronService.name);
    constructor(cronDatabaseService, userDatabaseService, newsDatabaseService, authCfg) {
        this.cronDatabaseService = cronDatabaseService;
        this.userDatabaseService = userDatabaseService;
        this.newsDatabaseService = newsDatabaseService;
        this.authCfg = authCfg;
    }
    async getStatus({ schedule }) {
        console.log('Email service is running!', new Date().toISOString(), 'schedule', schedule);
        return 'Email service is running!';
    }
    async createCronJob(name, startTime, schedule, status) {
        const dateNow = new Date();
        // Parse the startTime to a Date object
        const startDateTime = startTime ? new Date(startTime) : undefined;
        // // Check if startTime is at least one hour after dateNow
        // const oneHourInMillis = 60 * 60 * 1000;
        // if (startDateTime.getTime() - dateNow.getTime() < oneHourInMillis) {
        //   throw new Error(
        //     'Start time must be at least one hour after the current time.'
        //   );
        // }
        // Convert the schedule (datetime string) to a Date object
        const nextRun = (0, _utils_1.TimeCalculator)(schedule, startDateTime);
        const savedCron = {
            name,
            schedule,
            startTime: startDateTime,
            createdAt: dateNow,
            updatedAt: dateNow,
            status,
            nextRun,
        };
        const res = await this.cronDatabaseService
            .createCron(savedCron)
            .catch((error) => {
            console.error('Error saving to database:', error);
            return null;
        });
        if (!res) {
            throw new Error('Failed to save cron job to the database.');
        }
        // this.logger.log(`Successfully created cron job with ID: ${res.id}`);
        return {
            success: true,
            message: 'Cron job started successfully',
            data: res,
        };
    }
    async getCronJobs() {
        const cronJobs = await this.cronDatabaseService.findManyCron();
        if (!cronJobs || cronJobs.length === 0) {
            throw new common_1.HttpException('No cron jobs found', common_1.HttpStatus.NOT_FOUND);
        }
        // Map the cron jobs to the desired format
        return cronJobs;
    }
    async updateCronJob(id, cronName, startTime, schedule, status) {
        const dateNow = new Date();
        console.log('Updating cron job with ID:', id, 'cronName:', cronName, 'startTime:', startTime, 'schedule:', schedule, 'status:', status);
        const data = await this.cronDatabaseService.findUniqueCron({ id });
        // Fallback to existing schedule if not provided
        schedule = schedule || data.schedule;
        // Parse the startTime to a Date object
        const startDateTime = startTime ? new Date(startTime) : data.startTime;
        // Only skip update if only the name changed, otherwise proceed and trigger Azure Function.
        if (cronName !== undefined &&
            cronName !== data.name &&
            startDateTime.getTime() === new Date(data.startTime).getTime() &&
            schedule === data?.schedule &&
            status === data?.status) {
            const data = await this.cronDatabaseService.updateCron({
                where: { id },
                data: { name: cronName, updatedAt: dateNow },
            });
            return {
                success: true,
                message: 'No changes detected except name, cron job not updated',
                data,
            };
        }
        let nextRun;
        if (schedule) {
            nextRun = (0, _utils_1.TimeCalculator)(schedule, startDateTime);
        }
        console.log('Next run calculated as:', nextRun, 'Start time:', startDateTime);
        if (startDateTime < nextRun) {
            nextRun = startDateTime;
        }
        const newCron = (0, _utils_1.getCronExpression)(schedule, startDateTime);
        const updatedCron = {
            name: cronName,
            startTime: startDateTime,
            updatedAt: dateNow,
            status,
            nextRun,
            schedule,
        };
        try {
            await fetch('http://localhost:7071/api/scheduleJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.authCfg.static_token_cron_trigger}`,
                },
                body: JSON.stringify({
                    status,
                    newCron,
                    startTime,
                }),
            });
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof common_1.HttpException
                ? error.message
                : 'Failed to call Azure Function: scheduleJob', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.BAD_GATEWAY);
        }
        const updatedData = await this.cronDatabaseService
            .updateCron({ where: { id }, data: updatedCron })
            .catch((error) => {
            console.error('Error updating database:', error);
            throw new common_1.HttpException('Failed to update cron job in the database', common_1.HttpStatus.BAD_REQUEST);
        });
        if (!updatedData) {
            throw new Error('Failed to update cron job');
        }
        return {
            success: true,
            message: 'Cron job updated successfully',
            data: updatedData,
        };
    }
    async deleteCronJob(id) {
        const idNum = parseInt(id, 10);
        const job = await this.cronDatabaseService.findUniqueCron({ id: idNum });
        if (job) {
            await this.cronDatabaseService.deleteCron({ id: idNum });
            return { success: true, message: 'Cron job stopped successfully' };
        }
        else {
            return { success: false, message: 'Cron job not found' };
        }
    }
    async sendScheduledEmails(emailData) {
        try {
            const users = await this.userDatabaseService.findAll({
                where: { subscription: true },
            });
            if (users.length === 0) {
                throw new Error('No users to send email to');
            }
            const { sentUsers, errorUsers } = await (0, nodemailer_1.sendEmailAzure)(users, emailData.subject, emailData.html);
            console.log('Scheduled emails sent successfully', sentUsers, errorUsers);
        }
        catch (error) {
            console.error('Failed to send scheduled emails', error);
        }
    }
    async sendEmail() {
        const email = await this.newsDatabaseService.findFirst({ status: true }, { createdAt: 'desc' });
        if (!email) {
            throw new Error('No email found to send');
        }
        console.log('email', email);
        const { title, content } = email;
        const users = await this.userDatabaseService.findAll({
            where: { subscription: true },
        });
        console.log('users', users);
        if (users.length === 0) {
            throw new Error('No users to send email to');
        }
        const { sentUsers, errorUsers } = await (0, nodemailer_1.sendEmailAzure)(users, title, content);
        console.log('Scheduled emails sent successfully', sentUsers, errorUsers);
        return {
            success: true,
            message: 'Scheduled emails sent successfully',
            data: { sentUsers, errorUsers },
        };
    }
    // async restartCronJobs() {
    //   try {
    //     const cronJobs = await this.cronDatabaseService.findManyCron();
    //     for (const cronJob of cronJobs) {
    //       const { name, cronTime, startTime, schedule } = cronJob;
    //       const job = cron.schedule(cronTime, () => {
    //         this.sendScheduledEmails({
    //           subject: 'Scheduled Email',
    //           html: '<p>This is a scheduled email.</p>',
    //         });
    //       });
    //       job.start();
    //       this.cronJobs.set(name, job);
    //       console.log(`Cron job ${name} restarted`);
    //     }
    //   } catch (error) {
    //     console.error('Failed to restart cron jobs', error);
    //   }
    // }
    async automatedNews() {
        const users = await this.userDatabaseService.findAll({
            where: { subscription: true },
        });
        if (users.length === 0) {
            throw new common_1.HttpException('No users to send email to', common_1.HttpStatus.NOT_FOUND);
        }
        const email = await this.newsDatabaseService.findFirst({ status: true });
        if (!email) {
            throw new common_1.HttpException('No news to send email to', common_1.HttpStatus.NOT_FOUND);
        }
        // const { sentUsers, errorUsers } = await sendEmailAzure(
        //   users,
        //   email.title,
        //   email.content
        // );
        const { sentUsers, errorUsers } = await (0, nodemailer_1.sendEmailsGmail)(users, email.title, email.content);
        // const { sentUsers, errorUsers } = {
        //   sentUsers: ['asds'],
        //   errorUsers: [],
        // };
        // Remove seconds and milliseconds from sendTime
        const sendTime = new Date();
        sendTime.setSeconds(0, 0);
        const emailUpdate = await this.newsDatabaseService.updateNews(email.id, { status: false, sendTime } // Update the status to false after sending
        );
        if (!emailUpdate) {
            throw new common_1.HttpException('Failed to update email status', common_1.HttpStatus.BAD_REQUEST);
        }
        const cronData = await this.cronDatabaseService.findUniqueCron({
            id: 1,
        });
        let nextRun;
        const schedule = cronData.schedule;
        if (schedule) {
            // If schedule is an array, use the first element as the key
            const now = new Date();
            now.setSeconds(0, 0); // Set seconds and milliseconds to zero
            nextRun = (0, _utils_1.TimeCalculator)(schedule, now);
        }
        const updateCronDatabase = {
            nextRun,
            lastRun: new Date(),
        };
        console.log('nextRun', nextRun);
        await this.cronDatabaseService.updateCron({
            where: { id: 1 },
            data: updateCronDatabase,
        });
        return {
            data: { sentUsers, errorUsers },
            success: true,
            message: 'Email sent successfully',
        };
    }
    catch(error) {
        // Handle error
        console.error('Error sending email:', error);
        throw new common_1.HttpException('Failed to send email', common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.CronService = CronService;
exports.CronService = CronService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(3, (0, common_1.Inject)(auth_config_1.default.KEY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof _database_1.CronDatabaseService !== "undefined" && _database_1.CronDatabaseService) === "function" ? _a : Object, typeof (_b = typeof _database_1.UserDatabaseService !== "undefined" && _database_1.UserDatabaseService) === "function" ? _b : Object, typeof (_c = typeof _database_1.NewsDatabaseService !== "undefined" && _database_1.NewsDatabaseService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _d : Object])
], CronService);


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const cron_service_1 = __webpack_require__(76);
const dto_1 = __webpack_require__(78);
const dtos_1 = __webpack_require__(66);
const _auth_1 = __webpack_require__(9);
let CronController = class CronController {
    constructor(cronService) {
        this.cronService = cronService;
    }
    async getStatus(body) {
        return this.cronService.getStatus({ schedule: body.schedule });
    }
    async createCronJobs(cronData) {
        try {
            const res = await this.cronService.createCronJob(cronData.name, cronData.startTime, cronData.schedule, cronData.status);
            return res;
        }
        catch (error) {
            console.error('Error starting cron job:', error);
            throw new common_1.HttpException('Failed to start cron job', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCronJobs() {
        try {
            const data = await this.cronService.getCronJobs();
            return { success: true, data, message: 'Cron jobs fetched successfully' };
        }
        catch (error) {
            console.error('Error fetching cron jobs:', error);
            throw new common_1.HttpException('Failed to fetch cron jobs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCronJob(cronData) {
        try {
            console.log('Updating cron job with data:', cronData);
            const response = await this.cronService.updateCronJob(cronData.id, cronData?.name, cronData?.startTime, cronData?.schedule, cronData?.status);
            return response;
        }
        catch (error) {
            console.error('Error updating cron job:', error);
            throw new common_1.HttpException('Failed to update cron job', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteCronJob(id) {
        try {
            return await this.cronService.deleteCronJob(id);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to stop cron job', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async automatedNews() {
        return await this.cronService.automatedNews();
    }
};
exports.CronController = CronController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, _auth_1.AuthMode)('static'),
    (0, common_1.Get)('status'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], CronController.prototype, "getStatus", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('create-job'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof dtos_1.CronCreateDto !== "undefined" && dtos_1.CronCreateDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CronController.prototype, "createCronJobs", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('get-jobs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CronController.prototype, "getCronJobs", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('update-job'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_f = typeof dto_1.CronUpdateDto !== "undefined" && dto_1.CronUpdateDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CronController.prototype, "updateCronJob", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Post)('delete-job/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], CronController.prototype, "deleteCronJob", null);
tslib_1.__decorate([
    (0, _auth_1.AuthMode)('static'),
    (0, common_1.UseGuards)(_auth_1.JwtAuthGuard),
    (0, common_1.Get)('automatednews'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], CronController.prototype, "automatedNews", null);
exports.CronController = CronController = tslib_1.__decorate([
    (0, common_1.Controller)('cron'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof cron_service_1.CronService !== "undefined" && cron_service_1.CronService) === "function" ? _a : Object])
], CronController);


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(79), exports);


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronStopDto = exports.CronUpdateDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(60);
class CronUpdateDto {
}
exports.CronUpdateDto = CronUpdateDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CronUpdateDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CronUpdateDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CronUpdateDto.prototype, "cronTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CronUpdateDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], CronUpdateDto.prototype, "schedule", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CronUpdateDto.prototype, "status", void 0);
class CronStopDto {
}
exports.CronStopDto = CronStopDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CronStopDto.prototype, "cronName", void 0);


/***/ }),
/* 80 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const helmet_1 = tslib_1.__importDefault(__webpack_require__(80));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // const logger = app.get(WinstonLoggerService); // Retrieve the logger
    // app.useLogger(logger);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || process.env.BACKEND_PORT || 3000;
    await app.listen(port);
    // logger.log(
    //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    // );
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;