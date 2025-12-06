"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _nestjscommand = require("nestjs-command");
const _appmodule = require("./app/app.module");
async function bootstrap() {
    const app = await _core.NestFactory.createApplicationContext(_appmodule.AppModule, {
        logger: [
            'error'
        ]
    });
    try {
        await app.select(_nestjscommand.CommandModule).get(_nestjscommand.CommandService).exec();
        await app.close();
    } catch (error) {
        console.error(error);
        await app.close();
        process.exit(1);
    }
}
bootstrap();

//# sourceMappingURL=cli.js.map