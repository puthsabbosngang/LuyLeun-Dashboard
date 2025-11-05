import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/database';
import { Staff } from '../entities/Staff';
import { User } from '../entities/User';
import { authenticateToken } from '../middleware/authToken';

const router = Router();

// Get all staff
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const staffRepo = db.getRepository(Staff);
    
    const staff = await staffRepo.find({
      relations: ['user'],
      select: {
        id: true,
        full_name: true,
        role: true,
        phone: true,
        user_id: true,
        user: {
          id: true,
          username: true,
          status: true,
          type: true,
          account_name: true,
          created_at: true,
          updated_at: true
        }
      }
    });

    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get staff by ID
router.get('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const staffRepo = db.getRepository(Staff);
    
    const staff = await staffRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
      select: {
        id: true,
        full_name: true,
        role: true,
        phone: true,
        user_id: true,
        user: {
          id: true,
          username: true,
          status: true,
          type: true,
          account_name: true,
          created_at: true,
          updated_at: true
        }
      }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new staff
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const staffRepo = db.getRepository(Staff);
    const userRepo = db.getRepository(User);
    const { full_name, role, phone, user_data } = req.body;

    // If creating a new user along with staff
    let userId = req.body.user_id;
    if (user_data && !req.body.user_id) {
      // Hash password before creating user
      if (user_data.password) {
        user_data.password = await bcrypt.hash(user_data.password, 10);
      }
      
      // Set account_name to the same value as full_name (only if full_name is provided)
      if (full_name) {
        user_data.account_name = full_name;
      }
      
      // Ensure timestamps are set
      const now = new Date();
      user_data.created_at = now;
      user_data.updated_at = now;
      
      const newUser = userRepo.create(user_data);
      const result = await userRepo.save(newUser);
      // TypeORM save can return array or single object, handle both cases
      const savedUser = Array.isArray(result) ? result[0] : result;
      userId = savedUser.id;
    }

    const newStaff = staffRepo.create({
      full_name,
      role,
      phone,
      user_id: userId
    });

    const savedStaff = await staffRepo.save(newStaff);
    
    // Fetch the complete staff record with user relation
    const completeStaff = await staffRepo.findOne({
      where: { id: savedStaff.id },
      relations: ['user']
    });

    res.status(201).json(completeStaff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update staff
router.put('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const staffRepo = db.getRepository(Staff);
    const userRepo = db.getRepository(User);
    const { full_name, role, phone, user_data } = req.body;
    
    const staff = await staffRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user']
    });
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Update staff data
    if (full_name !== undefined) staff.full_name = full_name;
    if (role !== undefined) staff.role = role;
    if (phone !== undefined) staff.phone = phone;

    await staffRepo.save(staff);

    // Update user data if provided
    if (user_data && staff.user) {
      const user = staff.user;
      if (user_data.username !== undefined) user.username = user_data.username;
      if (user_data.password !== undefined) {
        // Hash password if provided
        user.password = await bcrypt.hash(user_data.password, 10);
      }
      if (user_data.status !== undefined) user.status = user_data.status;
      
      // If full_name was updated, also update account_name
      if (full_name !== undefined && full_name) {
        user.account_name = full_name;
      }
      
      // Always update the updated_at timestamp when user data is modified
      user.updated_at = new Date();
      
      await userRepo.save(user);
    } else if (staff.user && (full_name !== undefined || role !== undefined || phone !== undefined)) {
      // Even if no user_data is provided, update the timestamp and account_name if staff data changed
      if (full_name !== undefined && full_name) {
        staff.user.account_name = full_name;
      }
      staff.user.updated_at = new Date();
      await userRepo.save(staff.user);
    }

    // Return updated staff with user relation
    const updatedStaff = await staffRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user']
    });

    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete staff
router.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const staffRepo = db.getRepository(Staff);
    const userRepo = db.getRepository(User);
    
    const staff = await staffRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user']
    });
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Delete staff first
    await staffRepo.remove(staff);
    
    // Then delete the associated user if it exists
    if (staff.user) {
      await userRepo.remove(staff.user);
    }
    
    res.json({ message: 'Staff and associated user deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;