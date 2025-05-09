import Department from "../models/Department.js";

/**
 * Create a new department
 */
export const createDepartment = async (req, res) => {
    const { name } = req.body;

    try {
        const existingDepartment = await Department.query().findOne({ name });

        if (existingDepartment) {
            return res.status(400).json({ message: "Department already exists!" });
        }

        const newDepartment = await Department.query().insert({ name });

        res.status(201).json({ message: "Department created successfully!", department: newDepartment });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all departments
 */
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.query();
        res.status(200).json(departments);
    } catch (err) {
        console.error("Error fetching departments:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a department by ID
 */
export const getDepartmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await Department.query().findById(id);

        if (!department) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json(department);
    } catch (err) {
        console.error("Error fetching department:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update a department
 */
export const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedDepartment = await Department.query().patchAndFetchById(id, { name });

        if (!updatedDepartment) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json({ message: "Department updated successfully!", department: updatedDepartment });
    } catch (err) {
        console.error("Error updating department:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRows = await Department.query().deleteById(id);

        if (!deletedRows) {
            return res.status(404).json({ message: "Department not found!" });
        }

        res.status(200).json({ message: "Department deleted successfully!" });
    } catch (err) {
        console.error("Error deleting department:", err.message);
        res.status(500).json({ error: err.message });
    }
};
