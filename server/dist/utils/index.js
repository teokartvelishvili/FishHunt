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
    get formatFileName () {
        return formatFileName;
    },
    get imageFileFilter () {
        return imageFileFilter;
    }
});
const imageFileFilter = (req, file, cb)=>{
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp|svg\+xml|bmp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const formatFileName = (originalName)=>{
    const timestamp = new Date().getTime();
    const name = originalName.toLowerCase().replace(/\s+/g, '-');
    return `${timestamp}-${name}`;
};

//# sourceMappingURL=index.js.map