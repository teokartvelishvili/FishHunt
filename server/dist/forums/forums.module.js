"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumsModule", {
    enumerable: true,
    get: function() {
        return ForumsModule;
    }
});
const _common = require("@nestjs/common");
const _forumsservice = require("./forums.service");
const _forumscontroller = require("./forums.controller");
const _mongoose = require("@nestjs/mongoose");
const _forumschema = require("./schema/forum.schema");
const _usersmodule = require("../users/users.module");
const _awss3module = require("../aws-s3/aws-s3.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ForumsModule = class ForumsModule {
};
ForumsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _forumschema.Forum.name,
                    schema: _forumschema.ForumSchema
                },
                {
                    name: _forumschema.Comment.name,
                    schema: _forumschema.CommentSchema
                }
            ]),
            _usersmodule.UsersModule,
            _awss3module.AwsS3Module
        ],
        controllers: [
            _forumscontroller.ForumsController
        ],
        providers: [
            _forumsservice.ForumsService
        ]
    })
], ForumsModule);

//# sourceMappingURL=forums.module.js.map