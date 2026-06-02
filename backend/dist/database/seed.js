"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const adminEmail = 'admin@example.com';
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const admin = userRepository.create({
            name: 'System Administrator Account',
            email: adminEmail,
            password: hashedPassword,
            address: '123 Admin Street, System City, Country',
            role: user_entity_1.UserRole.ADMIN,
        });
        await userRepository.save(admin);
        console.log('Seed complete');
    }
    else {
        console.log('Admin already exists. Seed skipped.');
    }
    await app.close();
}
bootstrap().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map