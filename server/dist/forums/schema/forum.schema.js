"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Comment () {
        return Comment;
    },
    get CommentSchema () {
        return CommentSchema;
    },
    get Forum () {
        return Forum;
    },
    get ForumSchema () {
        return ForumSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = /*#__PURE__*/ _interop_require_wildcard(require("mongoose"));
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Comment = class Comment extends _mongoose1.Document {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.default.Schema.Types.ObjectId,
        auto: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.default === "undefined" || typeof _mongoose1.default.Schema === "undefined" || typeof _mongoose1.default.Schema.Types === "undefined" || typeof _mongoose1.default.Schema.Types.ObjectId === "undefined" ? Object : _mongoose1.default.Schema.Types.ObjectId)
], Comment.prototype, "_id", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.default.Schema.Types.ObjectId,
        ref: 'User'
    }),
    _ts_metadata("design:type", typeof _mongoose1.default === "undefined" || typeof _mongoose1.default.Schema === "undefined" || typeof _mongoose1.default.Schema.Types === "undefined" || typeof _mongoose1.default.Schema.Types.ObjectId === "undefined" ? Object : _mongoose1.default.Schema.Types.ObjectId)
], Comment.prototype, "user", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String
    }),
    _ts_metadata("design:type", String)
], Comment.prototype, "content", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.default.Schema.Types.ObjectId,
        default: null
    }),
    _ts_metadata("design:type", typeof _mongoose1.default === "undefined" || typeof _mongoose1.default.Schema === "undefined" || typeof _mongoose1.default.Schema.Types === "undefined" || typeof _mongoose1.default.Schema.Types.ObjectId === "undefined" ? Object : _mongoose1.default.Schema.Types.ObjectId)
], Comment.prototype, "parentId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            {
                type: _mongoose1.default.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Number,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            _mongoose1.default.Schema.Types.ObjectId
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Comment.prototype, "likesArray", void 0);
Comment = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Comment);
const CommentSchema = _mongoose.SchemaFactory.createForClass(Comment);
let Forum = class Forum extends _mongoose1.Document {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String
    }),
    _ts_metadata("design:type", String)
], Forum.prototype, "content", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.default.Schema.Types.ObjectId,
        ref: 'User'
    }),
    _ts_metadata("design:type", typeof _mongoose1.default === "undefined" || typeof _mongoose1.default.Schema === "undefined" || typeof _mongoose1.default.Schema.Types === "undefined" || typeof _mongoose1.default.Schema.Types.ObjectId === "undefined" ? Object : _mongoose1.default.Schema.Types.ObjectId)
], Forum.prototype, "user", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            String
        ],
        enum: {
            values: [
                'fishing',
                'hunting',
                'camping',
                'all'
            ],
            message: 'Tags must be one of: fishing, hunting, camping, all'
        },
        default: [
            'all'
        ]
    }),
    _ts_metadata("design:type", Array)
], Forum.prototype, "tags", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            {
                type: CommentSchema
            }
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Forum.prototype, "comments", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Number,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Forum.prototype, "likes", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            _mongoose1.default.Schema.Types.ObjectId
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Forum.prototype, "likesArray", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String
    }),
    _ts_metadata("design:type", String)
], Forum.prototype, "imagePath", void 0);
Forum = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Forum);
const ForumSchema = _mongoose.SchemaFactory.createForClass(Forum);

//# sourceMappingURL=forum.schema.js.map