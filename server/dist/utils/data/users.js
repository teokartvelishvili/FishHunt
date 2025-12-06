"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "users", {
    enumerable: true,
    get: function() {
        return users;
    }
});
const _roleenum = require("../../types/role.enum");
const _password = require("../password");
const users = async ()=>[
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: await (0, _password.hashPassword)('123456'),
            role: _roleenum.Role.Admin
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: await (0, _password.hashPassword)('123456'),
            role: _roleenum.Role.User
        },
        {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: await (0, _password.hashPassword)('123456'),
            role: _roleenum.Role.Seller
        }
    ];

//# sourceMappingURL=users.js.map