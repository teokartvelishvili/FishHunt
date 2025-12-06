"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("dotenv/config");
const _core = require("@nestjs/core");
const _appmodule = require("./app/app.module");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _path = require("path");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _express = /*#__PURE__*/ _interop_require_wildcard(require("express"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule, {
        logger: [
            'error',
            'warn',
            'debug',
            'log',
            'verbose'
        ]
    });
    // Configure express middleware for larger file uploads
    app.use(_express.json({
        limit: '50mb'
    }));
    app.use(_express.urlencoded({
        limit: '50mb',
        extended: true
    }));
    app.use(_express.raw({
        limit: '50mb'
    }));
    app.use((0, _helmet.default)());
    app.use((0, _cookieparser.default)());
    app.enableCors({
        origin: (origin, callback)=>{
            const allowedOrigins = [
                'https://www.fishhunt.vercel.app',
                'https://fishhunt.ge',
                'https://www.fishhunt.ge',
                'https://fishhunt.vercel.app',
                'https://fishhunt.vercel.app/home',
                'https://fishhunt-web.vercel.app',
                'https://www.fishhunt-web.vercel.app',
                'fishhunt-git-master-teokartvelishvilis-projects.vercel.app',
                'fishhunt-muj5s8qno-teokartvelishvilis-projects.vercel.app',
                'https://fishhunt-git-main-aberoshvilis-projects.vercel.app',
                'https://fishhunt-aberoshvilis-projects.vercel.app',
                'http://localhost:3000',
                'https://localhost:3000',
                'http://localhost:4000',
                'https://localhost:4000',
                // Add development URLs that might be used
                'http://127.0.0.1:3000',
                'https://127.0.0.1:3000',
                'http://127.0.0.1:4000',
                'https://127.0.0.1:4000'
            ];
            // Allow requests with no origin (like mobile apps, curl requests)
            if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.match(/localhost/) || origin.includes('.vercel.app') // Allow all Vercel domains
            ) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS'
        ],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'forum-id',
            'Origin',
            'Accept',
            'X-Requested-With',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ],
        exposedHeaders: [
            'Content-Length',
            'X-Kuma-Revision'
        ],
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.enableVersioning({
        type: _common.VersioningType.URI,
        defaultVersion: '1'
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.use('/favicon.ico', (req, res)=>res.status(204).send());
    // Setup static file serving for uploads
    app.useStaticAssets((0, _path.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/'
    });
    // Make sure uploads directory exists
    const uploadsDir = (0, _path.join)(__dirname, '..', 'uploads');
    const logosDir = (0, _path.join)(uploadsDir, 'logos');
    if (!_fs.existsSync(uploadsDir)) {
        _fs.mkdirSync(uploadsDir, {
            recursive: true
        });
    }
    if (!_fs.existsSync(logosDir)) {
        _fs.mkdirSync(logosDir, {
            recursive: true
        });
    }
    const config = new _swagger.DocumentBuilder().setTitle('fishhunt  API').setDescription('fishhunt E-commerce REST API').setVersion('1.0').addBearerAuth().build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('docs', app, document); // დარწმუნდით, რომ როუტი არის '/docs'
    app.enableShutdownHooks();
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0'); // ვერსელისთვის საჭიროა '0.0.0.0'
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

//# sourceMappingURL=main.js.map