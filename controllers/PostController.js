import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't get post."
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndUpdate({
                _id: postId,
            },
            {
                $inc: {
                    viewCount: 1
                }
            },
            {
                returnDocument: 'after'
            }, (err, doc) => {
                if (err) {
                    console.log(err);
                    res.json({
                        message: "don't get post"
                    })
                }

                if (!doc) {
                    res.json({
                        message: "don't found post"
                    })
                }

                res.json(doc)
            }).populate('user');
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't get post."
        })
    }
};

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(item => item.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't get tags."
        })
    }
}

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndDelete({
            _id: postId,
        }, (err, doc) =>{
            if(err){
                console.log(err);
                res.json({
                    message: "don't remove post"
                })
            }

            if(!doc){
                console.log(err);
                res.json({
                    message: "don't found post"
                })
            }

            res.json({
                message: "Posts deleted"
            })
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't get post."
        })
    }
}

export const updatePost = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageURL: req.body.imageURL,
                user: req.userId,
                tags: req.body.tags,
            }
        );

        res.json({
            message: "Post updated"
        })

    }catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't update post."
        })
    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageURL: req.body.imageURL,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Don't create post."
        })
    }
}