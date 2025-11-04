import { Router, Request, Response } from 'express';
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
    const { full_name, role, phone } = req.body;
    
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
    
    const staff = await staffRepo.findOne({
      where: { id: parseInt(id) }
    });
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    await staffRepo.remove(staff);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;