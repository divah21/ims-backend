import path from "path";
import fs from "fs";
import Newsfeed from "../models/Newsfeed.js";

/**
 * Create a newsfeed post with an image upload
 */
export const createNewsfeed = async (req, res) => {
    const { title, content, author_id } = req.body;
    const image_url = req.file ? `${req.file.filename}` : null;

    try {
        const newPost = await Newsfeed.query().insert({
            title,
            content,
            image_url,
            author_id,
        });

        res.status(201).json({ message: "Newsfeed post created successfully!", post: newPost });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all newsfeed posts
 */
export const getAllNewsfeed = async (req, res) => {
    try {
        const posts = await Newsfeed.query().withGraphFetched("author");
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching newsfeed:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a newsfeed post by ID
 */
export const getNewsfeedById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Newsfeed.query().findById(id).withGraphFetched("author");

        if (!post) {
            return res.status(404).json({ message: "Newsfeed post not found!" });
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching newsfeed post:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update a newsfeed post with optional image upload
 */
export const updateNewsfeed = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const image_url = req.file ? `/uploads/newsfeed/${req.file.filename}` : null;

    try {
        const existingPost = await Newsfeed.query().findById(id);
        if (!existingPost) {
            return res.status(404).json({ message: "Newsfeed post not found!" });
        }

        // Delete old image if a new one is uploaded
        if (req.file && existingPost.image_url) {
            const oldImagePath = path.join(process.cwd(), existingPost.image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedPost = await Newsfeed.query().patchAndFetchById(id, {
            title,
            content,
            image_url: image_url || existingPost.image_url,
        });

        res.status(200).json({ message: "Newsfeed post updated successfully!", post: updatedPost });
    } catch (err) {
        console.error("Error updating newsfeed post:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete a newsfeed post and its associated image
 */
export const deleteNewsfeed = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Newsfeed.query().findById(id);
        if (!post) {
            return res.status(404).json({ message: "Newsfeed post not found!" });
        }

        // Delete image file if it exists
        if (post.image_url) {
            const imagePath = path.join(process.cwd(), post.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Newsfeed.query().deleteById(id);

        res.status(200).json({ message: "Newsfeed post deleted successfully!" });
    } catch (err) {
        console.error("Error deleting newsfeed post:", err.message);
        res.status(500).json({ error: err.message });
    }
};
