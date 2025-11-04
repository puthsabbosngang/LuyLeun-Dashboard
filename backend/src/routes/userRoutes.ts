import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/database";
import { User } from "../entities/User";
import { Staff } from "../entities/Staff";
import { authenticateToken } from "../middleware/authToken"; // optional if you want protected routes

const router = express.Router();

/**
 * GET ALL USERS (staff or customer)
 * Query param: ?type=staff or ?type=customer
 */
router.get("/", /*authenticateToken,*/ async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    if (type === "staff") {
      const staffs = await staffRepo
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.user", "user")
        .select([
          "staff.id",
          "staff.full_name",
          "staff.role",
          "staff.phone",
          "staff.user_id",
          "user.id",
          "user.username",
          "user.type",
          "user.status",
          "user.created_at",
          "user.updated_at",
        ])
        .orderBy("staff.id", "ASC")
        .getMany();

      res.json(staffs);
      return;
    }

    // default to customer if type not specified
    const customers = await userRepo.find({
      where: { type: "customer" },
      select: ["id", "username", "type", "status", "created_at", "updated_at"],
      order: { id: "ASC" },
    });

    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * GET SINGLE USER BY ID
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let staff = null;
    if (user.type === "staff") {
      staff = await staffRepo.findOne({ where: { user_id: user.id } });
    }

    res.json({ ...user, staff });
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
});

/**
 * CREATE NEW USER (Customer or Staff)
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, type, full_name, role, phone } = req.body;

    if (!username || !password || !type) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const existingUser = await userRepo.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
      username,
      password: hashedPassword,
      type,
      status: "active",
      account_name: type === "staff" ? full_name : null, // Set acc_name same as full_name for staff
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedUser = await userRepo.save(newUser);

    if (type === "staff") {
      const newStaff = staffRepo.create({
        full_name, // This value is also saved as account_name in user table
        role: role || "staff",
        phone,
        user_id: savedUser.id,
      });
      await staffRepo.save(newStaff);
    }

    res.status(201).json({
      message: `${type} created successfully`,
      user: savedUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

/**
 * UPDATE USER (Customer or Staff)
 */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, type, full_name, role, phone, status } = req.body;

    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.username = username || user.username;
    user.type = type || user.type;
    user.status = status || user.status;
    user.updated_at = new Date();

    // Handle password update if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (user.type === "staff") {
      let staff = await staffRepo.findOne({ where: { user_id: user.id } });
      if (!staff) {
        staff = staffRepo.create({ full_name, role, phone, user_id: user.id });
        // Set account_name same as full_name for new staff
        user.account_name = full_name;
      } else {
        staff.full_name = full_name || staff.full_name;
        staff.role = role || staff.role;
        staff.phone = phone || staff.phone;
        // Update account_name if full_name is being updated
        if (full_name) {
          user.account_name = full_name;
        }
      }
      await staffRepo.save(staff);
    }

    const updatedUser = await userRepo.save(user);

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

/**
 * DELETE USER (Customer or Staff)
 * For staff users: deletes from both staff table and user table using transaction
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRepo = db.getRepository(User);
    const staffRepo = db.getRepository(Staff);

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Use transaction to ensure both deletions succeed or fail together
    await db.transaction(async (transactionalEntityManager) => {
      if (user.type === "staff") {
        // First delete from staff table (foreign key constraint)
        const staff = await transactionalEntityManager.findOne(Staff, { where: { user_id: user.id } });
        if (staff) {
          console.log(`Deleting staff record for user_id: ${user.id}, staff_id: ${staff.id}`);
          await transactionalEntityManager.delete(Staff, { user_id: user.id });
        }
      }

      // Then delete from user table
      console.log(`Deleting user record for user_id: ${user.id}, type: ${user.type}`);
      await transactionalEntityManager.delete(User, { id: user.id });
    });

    res.json({ 
      message: user.type === "staff" 
        ? "Staff user deleted successfully from both user and staff tables" 
        : "User deleted successfully" 
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default router;