"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_zod4 = require("zod");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3333),
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("production"),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("\u26A0\uFE0F Invalid environment variables!", _env.error?.format());
  throw new Error("\u26A0\uFE0F Invalid environment variables!");
}
var env = _env.data;

// src/app.ts
var import_jwt = __toESM(require("@fastify/jwt"));

// src/use-cases/errors/email-already-exists-error.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("\u26A0\uFE0F Email already exists!");
  }
};

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "development" ? ["query"] : []
});

// src/repositories/prisma/prisma-organization-repository.ts
var PrismaOrganizationRepository = class {
  async create(data) {
    const organization = await prisma.organization.create({ data });
    return organization;
  }
  async findByEmail(email) {
    const organizationExists = await prisma.organization.findUnique({
      where: { email }
    });
    return organizationExists;
  }
  async findOrganizationById(id) {
    const organization = await prisma.organization.findUnique({ where: { id } });
    return organization;
  }
};

// src/use-cases/create-organization.ts
var CreateOrganizationUseCase = class {
  constructor(organizationsRepository) {
    this.organizationsRepository = organizationsRepository;
  }
  async execute({
    responsible_name,
    email,
    password,
    whatsApp,
    cep,
    street,
    state
  }) {
    const organizationAlreadyExists = await this.organizationsRepository.findByEmail(email);
    if (organizationAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }
    const organization = await this.organizationsRepository.create({
      responsible_name,
      email,
      password,
      whatsApp,
      cep,
      street,
      state
    });
    return { organization };
  }
};

// src/use-cases/factories/make-create-organization.ts
function makeCreateOrganizationUseCase() {
  const organizationsRepository = new PrismaOrganizationRepository();
  const useCase = new CreateOrganizationUseCase(organizationsRepository);
  return useCase;
}

// src/http/controllers/organization/create-organization.ts
var import_bcryptjs = require("bcryptjs");
var import_zod2 = require("zod");
async function create(request, reply) {
  const organizationSchema = import_zod2.z.object({
    responsibleName: import_zod2.z.string().min(4),
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6),
    cep: import_zod2.z.string().min(8),
    state: import_zod2.z.string().min(4),
    street: import_zod2.z.string(),
    whatsApp: import_zod2.z.string().min(12)
  });
  const { responsibleName, email, password, whatsApp, cep, street, state } = organizationSchema.parse(request.body);
  const passwordHash = await (0, import_bcryptjs.hash)(password, 6);
  const createOrganizationUseCase = makeCreateOrganizationUseCase();
  try {
    await createOrganizationUseCase.execute({
      responsible_name: responsibleName,
      email,
      password: passwordHash,
      whatsApp,
      state,
      cep,
      street
    });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(201).send();
}

// src/middleware/verifyJWT.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
}

// src/use-cases/errors/organization-not-found-error.ts
var OrganizationNotFoundError = class extends Error {
  constructor() {
    super("\u26A0\uFE0F Organization not found!");
  }
};

// src/use-cases/get-organization-details.ts
var GetOrganizationDetailsUseCase = class {
  constructor(organizationRepository) {
    this.organizationRepository = organizationRepository;
  }
  async execute(id) {
    const organization = await this.organizationRepository.findOrganizationById(id);
    if (!organization) {
      throw new OrganizationNotFoundError();
    }
    return { organization };
  }
};

// src/use-cases/factories/make-get-organization-details.ts
function makeGetOrganizationDetailsUseCase() {
  const organizationsRepository = new PrismaOrganizationRepository();
  const useCase = new GetOrganizationDetailsUseCase(organizationsRepository);
  return useCase;
}

// src/http/controllers/organization/get-organization-details.ts
async function getOrganizationDetails(request, reply) {
  const getOrganizationDetails2 = makeGetOrganizationDetailsUseCase();
  const { organization } = await getOrganizationDetails2.execute(
    request.user.sub
  );
  return reply.status(200).send({ organization: { ...organization, password: void 0 } });
}

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("\u26A0\uFE0F Invalid credentials!");
  }
};

// src/use-cases/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
var AuthenticateUseCase = class {
  constructor(organizationRepository) {
    this.organizationRepository = organizationRepository;
  }
  async execute({
    email,
    password
  }) {
    const organization = await this.organizationRepository.findByEmail(email);
    if (!organization) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatch = await (0, import_bcryptjs2.compare)(password, organization.password);
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }
    return { organization };
  }
};

// src/use-cases/factories/make-authenticate.ts
function makeAuthenticateUseCase() {
  const organizationsRepository = new PrismaOrganizationRepository();
  const useCase = new AuthenticateUseCase(organizationsRepository);
  return useCase;
}

// src/http/controllers/organization/authenticate.ts
var import_zod3 = require("zod");
async function authenticate(request, reply) {
  const authenticateSchema = import_zod3.z.object({
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string().min(6)
  });
  const { email, password } = authenticateSchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { organization } = await authenticateUseCase.execute({
      email,
      password
    });
    const token = reply.jwtSign({}, { sign: { sub: organization.id } });
    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}

// src/http/controllers/organization/routes.ts
async function organizationRoutes(app2) {
  app2.post("/organization", { onRequest: [verifyJWT] }, create);
  app2.post("/create-session", authenticate);
  app2.get("/organization-details", getOrganizationDetails);
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_jwt.default, { secret: env.JWT_SECRET });
app.register(organizationRoutes);
app.setErrorHandler((error, _, reply) => {
  if (error instanceof import_zod4.ZodError) {
    reply.status(400).send({ message: "\u26A0\uFE0F Validation error", issues: error.format() });
  }
  if (env.NODE_ENV === "development") {
    console.error(error);
  }
  reply.status(400).send({ message: "\u26A0\uFE0F Internal server error!" });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
