"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _mongoose = require("@nestjs/mongoose");
const _schedule = require("@nestjs/schedule");
const _usersmodule = require("../users/users.module");
const _nestjscommand = require("nestjs-command");
const _cartmodule = require("../cart/cart.module");
const _ordermodule = require("../orders/order.module");
const _paymentsmodule = require("../payments/payments.module");
const _appcontroller = require("./controllers/app.controller");
const _cloudinarymodule = require("../cloudinary/cloudinary.module");
const _appservice = require("./services/app.service");
const _awss3module = require("../aws-s3/aws-s3.module");
const _bannermodule = require("../banners/banner.module");
const _sharedservicesmodule = require("./shared-services.module");
const _aimodule = require("../ai/ai.module");
const _googlestrategy = require("../strategies/google.strategy");
const _config1 = require("../utils/config");
const _productsmodule = require("../products/products.module");
const _categoriesmodule = require("../categories/categories.module");
const _forumsmodule = require("../forums/forums.module");
const _youtubemodule = require("../youtube/youtube.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    '.env'
                ]
            }),
            _schedule.ScheduleModule.forRoot(),
            _mongoose.MongooseModule.forRootAsync({
                inject: [
                    _config.ConfigService
                ],
                useFactory: _config1.connectDB
            }),
            _nestjscommand.CommandModule,
            _productsmodule.ProductsModule,
            _usersmodule.UsersModule,
            _cartmodule.CartModule,
            _ordermodule.OrderModule,
            _cloudinarymodule.CloudinaryModule,
            _aimodule.AiModule,
            _forumsmodule.ForumsModule,
            _categoriesmodule.CategoriesModule,
            _paymentsmodule.PaymentsModule,
            _sharedservicesmodule.SharedServicesModule,
            _bannermodule.BannerModule,
            _youtubemodule.YoutubeModule,
            // SeedsModule,
            _awss3module.AwsS3Module
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _googlestrategy.GoogleStrategy,
            _productsmodule.IndexCleanupService
        ],
        exports: [
            _appservice.AppService
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map