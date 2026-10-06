import Application from '../models/Application.js';

const STATUS_VALUES = Application.STATUS_VALUES;

// GET /api/applications?status=&search=&sort=newest|oldest
export const getApplications = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;
    const query = { user: req.user.id };

    if (status) {
      if (!STATUS_VALUES.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(', ')}` });
      }
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ company: regex }, { role: regex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const applications = await Application.find(query).sort({ dateApplied: sortOrder });

    res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/stats
export const getStats = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id }).select('status');

    const total = applications.length;
    const counts = { applied: 0, interview: 0, offer: 0, rejected: 0 };
    applications.forEach((app) => {
      counts[app.status] += 1;
    });

    const responseRate = total === 0
      ? 0
      : Math.round(((counts.interview + counts.offer) / total) * 100);

    res.status(200).json({
      total,
      applied: counts.applied,
      interview: counts.interview,
      offer: counts.offer,
      rejected: counts.rejected,
      responseRate,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/:id
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

// POST /api/applications
export const createApplication = async (req, res, next) => {
  try {
    const { company, role, status, dateApplied, jobLink, salary, location, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company and role are required' });
    }

    if (status && !STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(', ')}` });
    }

    const application = await Application.create({
      user: req.user.id,
      company,
      role,
      status,
      dateApplied,
      jobLink,
      salary,
      location,
      notes,
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id
export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const allowedFields = ['company', 'role', 'status', 'dateApplied', 'jobLink', 'salary', 'location', 'notes'];

    if (req.body.status !== undefined && !STATUS_VALUES.includes(req.body.status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(', ')}` });
    }

    if (req.body.company !== undefined && !req.body.company) {
      return res.status(400).json({ message: 'Company cannot be empty' });
    }

    if (req.body.role !== undefined && !req.body.role) {
      return res.status(400).json({ message: 'Role cannot be empty' });
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    await application.save();

    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
};
