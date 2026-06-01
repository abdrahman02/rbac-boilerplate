import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../repositories/user.repository.js", () => ({
  findUsersForExport: vi.fn(),
  emailExists: vi.fn(),
  anonymizeDeletedEmail: vi.fn(),
  createUser: vi.fn(),
  assignRoleToUser: vi.fn(),
}));

vi.mock("../../repositories/password-reset.repository.js", () => ({
  createToken: vi.fn(),
}));

vi.mock("../../services/token.service.js", () => ({
  generateVerificationToken: vi.fn(),
  hashVerificationToken: vi.fn(),
}));

vi.mock("../../services/email.service.js", () => ({
  sendInviteEmail: vi.fn(),
}));

vi.mock("../../utils/hash.js", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("exceljs", () => ({
  default: {
    // biome-ignore lint/complexity/useArrowFunction: must be a constructable function for `new Workbook()`
    Workbook: vi.fn(function () {
      return {
        addWorksheet: vi.fn(() => ({
          addTable: vi.fn(),
          eachRow: vi.fn(),
          getColumn: vi.fn(() => ({ width: 0 })),
          views: [],
        })),
        xlsx: { writeBuffer: vi.fn().mockResolvedValue(Buffer.from("xlsx")) },
      };
    }),
  },
}));

import * as repo from "../../repositories/user.repository.js";
import * as userRepo from "../../repositories/user.repository.js";
import * as passwordResetRepo from "../../repositories/password-reset.repository.js";
import * as tokenSvc from "../../services/token.service.js";
import * as emailSvc from "../../services/email.service.js";
import { hashPassword } from "../../utils/hash.js";
import { buildUsersExportWorkbook, createUser } from "../user.service.js";

const MOCK_USERS = [
  {
    id: 1,
    fullName: "Alice Doe",
    email: "alice@example.com",
    isActive: true,
    roles: ["admin", "editor"],
    createdAt: new Date("2024-03-01T00:00:00.000Z"),
  },
  {
    id: 2,
    fullName: "Bob Smith",
    email: "bob@example.com",
    isActive: false,
    roles: [],
    createdAt: new Date("2024-04-10T00:00:00.000Z"),
  },
];

describe("buildUsersExportWorkbook", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a Buffer", async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    const result = await buildUsersExportWorkbook();
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it("calls findUsersForExport with empty filters when params are undefined", async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    await buildUsersExportWorkbook();
    expect(repo.findUsersForExport).toHaveBeenCalledWith({});
  });

  it("passes search and role filters through to the repository", async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    await buildUsersExportWorkbook("alice", "admin", undefined);
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: "alice", role: "admin", status: undefined });
  });

  it('converts status "active" string to boolean true for the repository', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    await buildUsersExportWorkbook(undefined, undefined, "active");
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: true });
  });

  it('converts status "inactive" string to boolean false for the repository', async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    await buildUsersExportWorkbook(undefined, undefined, "inactive");
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: false });
  });

  it("passes status undefined for unrecognised status strings", async () => {
    vi.mocked(repo.findUsersForExport).mockResolvedValueOnce(MOCK_USERS);
    await buildUsersExportWorkbook(undefined, undefined, "unknown");
    expect(repo.findUsersForExport).toHaveBeenCalledWith({ search: undefined, role: undefined, status: undefined });
  });
});

describe("createUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates user with placeholder hash and sends invite email", async () => {
    vi.mocked(userRepo.emailExists).mockResolvedValueOnce(false);
    vi.mocked(userRepo.anonymizeDeletedEmail).mockResolvedValueOnce(undefined);
    vi.mocked(hashPassword).mockResolvedValueOnce("placeholder-hash");
    vi.mocked(userRepo.createUser).mockResolvedValueOnce(42);
    vi.mocked(tokenSvc.generateVerificationToken).mockReturnValueOnce("rawtoken");
    vi.mocked(tokenSvc.hashVerificationToken).mockReturnValueOnce("tokenhash");
    vi.mocked(passwordResetRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(emailSvc.sendInviteEmail).mockResolvedValueOnce(undefined);

    const result = await createUser({ name: "Bob", email: "bob@example.com" });

    expect(result).toBe(42);
    expect(passwordResetRepo.createToken).toHaveBeenCalledWith(
      42,
      "tokenhash",
      expect.any(Date),
      true,
    );
    expect(emailSvc.sendInviteEmail).toHaveBeenCalledWith("bob@example.com", "Bob", "rawtoken");
  });

  it("invite token expires approximately 7 days from now", async () => {
    vi.mocked(userRepo.emailExists).mockResolvedValueOnce(false);
    vi.mocked(userRepo.anonymizeDeletedEmail).mockResolvedValueOnce(undefined);
    vi.mocked(hashPassword).mockResolvedValueOnce("placeholder-hash");
    vi.mocked(userRepo.createUser).mockResolvedValueOnce(1);
    vi.mocked(tokenSvc.generateVerificationToken).mockReturnValueOnce("rawtoken");
    vi.mocked(tokenSvc.hashVerificationToken).mockReturnValueOnce("tokenhash");
    vi.mocked(passwordResetRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(emailSvc.sendInviteEmail).mockResolvedValueOnce(undefined);

    const before = Date.now();
    await createUser({ name: "Bob", email: "bob@example.com" });
    const after = Date.now();

    const expiresAt = vi.mocked(passwordResetRepo.createToken).mock.calls[0]![2] as Date;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + sevenDaysMs - 1000);
    expect(expiresAt.getTime()).toBeLessThanOrEqual(after + sevenDaysMs + 1000);
  });

  it("throws EMAIL_TAKEN when email already exists", async () => {
    vi.mocked(userRepo.emailExists).mockResolvedValueOnce(true);

    await expect(createUser({ name: "Bob", email: "bob@example.com" })).rejects.toThrow("EMAIL_TAKEN");
    expect(emailSvc.sendInviteEmail).not.toHaveBeenCalled();
  });

  it("assigns roles when role_ids are provided", async () => {
    vi.mocked(userRepo.emailExists).mockResolvedValueOnce(false);
    vi.mocked(userRepo.anonymizeDeletedEmail).mockResolvedValueOnce(undefined);
    vi.mocked(hashPassword).mockResolvedValueOnce("placeholder-hash");
    vi.mocked(userRepo.createUser).mockResolvedValueOnce(5);
    vi.mocked(tokenSvc.generateVerificationToken).mockReturnValueOnce("rawtoken");
    vi.mocked(tokenSvc.hashVerificationToken).mockReturnValueOnce("tokenhash");
    vi.mocked(passwordResetRepo.createToken).mockResolvedValueOnce(undefined);
    vi.mocked(emailSvc.sendInviteEmail).mockResolvedValueOnce(undefined);
    vi.mocked(userRepo.assignRoleToUser).mockResolvedValueOnce(undefined);

    await createUser({ name: "Bob", email: "bob@example.com", role_ids: [1] });

    expect(userRepo.assignRoleToUser).toHaveBeenCalledWith(5, 1);
  });
});
