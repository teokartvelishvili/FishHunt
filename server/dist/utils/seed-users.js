"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateUsers", {
    enumerable: true,
    get: function() {
        return generateUsers;
    }
});
const _faker = require("@faker-js/faker");
const _argon2 = require("argon2");
const _roleenum = require("../types/role.enum");
// const ROLES = ['user', 'admin'] as const;
const ROLES = [
    _roleenum.Role.User,
    _roleenum.Role.Admin,
    _roleenum.Role.Seller
];
async function generateUsers(count) {
    const users = [];
    const hashedPassword = await (0, _argon2.hash)('password123');
    for(let i = 0; i < count; i++){
        const firstName = _faker.faker.person.firstName();
        const lastName = _faker.faker.person.lastName();
        const user = {
            name: `${firstName} ${lastName}`,
            email: _faker.faker.internet.email({
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase()
            }),
            password: hashedPassword,
            avatar: _faker.faker.image.avatar(),
            // isAdmin: i === 0, // First user is admin
            role: i === 0 ? _roleenum.Role.Admin : _faker.faker.helpers.arrayElement([
                _roleenum.Role.User,
                _roleenum.Role.Seller
            ]),
            createdAt: _faker.faker.date.past({
                years: 1
            }),
            reviews: _faker.faker.number.int({
                min: 0,
                max: 15
            }),
            purchases: _faker.faker.number.int({
                min: 1,
                max: 20
            })
        };
        users.push(user);
    }
    return users.sort((a, b)=>a.createdAt.getTime() - b.createdAt.getTime());
}

//# sourceMappingURL=seed-users.js.map