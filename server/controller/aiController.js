import OpenAI from "openai";
import sql from "../configs/db.js";
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import * as pdf from 'pdf-parse';


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: 'limit reached . upgrade to coontinue'
      })
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length
    });

    const content = response.choices[0].message.content;

    await sql`  INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }


    res.json({ success: true, content });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}



export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: 'limit reached . upgrade to coontinue'
      })
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`  INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
        `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }


    res.json({ success: true, content: content });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available for premium subscriptions',
      });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    console.log(secure_url);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};







export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth(); // or req.auth()
    const { image } = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available for premium subscriptions',
      });
    }
    
     if (!req.file) {
      return res.json({ success: false, message: 'No image uploaded' });
    }

    const imagePath = req.file.path; // ✅ correct access

    const { secure_url } = await cloudinary.uploader.upload(imagePath, {
      transformation: [
        {
          effect: 'background_removal',
          backgorund_removal: 'remove the backgorund'
        }
      ]
    });

    console.log(secure_url);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from Image', ${secure_url}, 'image')
    `;

    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available for premium subscriptions',
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: 'No image uploaded' });
    }

    const imagePath = req.file.path;

    // Upload to Cloudinary
    const { public_id } = await cloudinary.uploader.upload(imagePath, {
      resource_type: 'image',
    });

    // Remove object using AI transformation
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    // ✅ Correct SQL parameter usage
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${'Remove object ' + object + ' from Image'}, ${imageUrl}, 'image')
    `;

    return res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth(); // or req.auth()
    const resume = req.file
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available for premium subscriptions',
      });
    }


    if (resume.size() > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "Resume file size excesds allowed size (5MB)." })
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = ` Review the following resume and provide constructive feedback on its 
    strengths, weaknesses, and areas for improvement.
    Resume Content:\n\n${pdfData.text}`;



    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded Resume', ${content}, 'resume-review')
    `;

    return res.json({ success: true, content: content });

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

