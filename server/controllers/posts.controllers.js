import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Post from "../models/Post.js";
import fs from "fs-extra";

export const getHome = async (req, res) => {
  res.send({ message: "API Working" 

  });
}

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
    try {
      const { title, description } = req.body;
  
      // Validar campos requeridos
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }
  
      // Verificar si se recibió un archivo
      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "No image file uploaded." });
      }
  
      // Procesar la imagen
      const { image } = req.files;
  
      // Validar tipo de archivo y tamaño si es necesario
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files are allowed." });
      }
  
      if (image.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "Image size exceeds 5MB." });
      }
  
      const result = await uploadImage(image.tempFilePath);
      await fs.remove(image.tempFilePath);
  
      const newPost = new Post({
        title,
        description,
        image: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
  
      await newPost.save();
  
      return res.status(201).json({
        message: "Post created successfully!",
        post: newPost,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.sendStatus(404);
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: validate req.body before to update

    // if a new image is uploaded upload it to cloudinary
    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath);
      // add the new image to the req.body
      req.body.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (post && post.image.public_id) {
      await deleteImage(post.image.public_id);
    }

    if (!post) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};