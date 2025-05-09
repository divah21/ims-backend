import { Router } from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "../controllers/department.controller.js";

const departmentRouter = Router();

departmentRouter.post("/create", createDepartment);
departmentRouter.get("/get-all", getAllDepartments);
departmentRouter.get("/get-by-id/:id", getDepartmentById);
departmentRouter.patch("/:id", updateDepartment);
departmentRouter.delete("/:id", deleteDepartment);

export default departmentRouter;
