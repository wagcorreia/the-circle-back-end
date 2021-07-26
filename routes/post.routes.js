const express = require('express')
const router = express.Router()

const PostModel = require('../models/Post.model')
const UserModel = require('../models/User.model')

const isAuthenticated = require('../middlewares/isAuthenticated')
const attachCurrentUser = require('../middlewares/attachCurrentUser')

//criar post novo
router.post(
  '/post',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { title, description, terapiesfinding } = req.body

      const loggedInUser = req.currentUser

      const newPost = await PostModel.create({
        userId: loggedInUser._id,
        title: title,
        description: description,
        terapiesfinding: terapiesfinding,
      })
      console.log(newPost)

      const updatePost = await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $push: { postID: newPost._id } },
      )
      console.log(loggedInUser)

      if (updatePost) {
        return res.status(200).json(updatePost)
      }
      return res.status(201).json(updatePost)
    } catch (err) {
      next(err)
    }
  },
)

// Listar todos os posts
router.get(
  '/allposts',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const Allposts = await PostModel.find()

      return res.status(200).json(Allposts)
    } catch (err) {
      next(err)
    }
  },
)

//ver post especifico
router.get(
  '/post/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const post = await PostModel.findOne({
        _id: id,
      }).populate('post')

      if (post) {
        return res.status(200).json(post)
      }
      return res.status(404).json({ error: 'post nâo encontrado' })
    } catch (err) {
      next(err)
    }
  },
)
//deletar post especifico
router.delete(
  '/post/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      //buscar o post
      const posting = await PostModel.findOne({ _id: id })

      if (String(req.currentUser._id) !== String(posting.userId)) {
        return res.status(401).json({})
      }

      // Deletar post do banco
      const deletepost = await PostModel.deleteOne({
        _id: id,
      })

      if (deletepost.n > 0) {
        // Remover o id da lista de referências do usuário
        const updateUser = await UserModel.findOneAndUpdate(
          { _id: posting.userId },
          { $pull: { postID: id } }, // O pull remove o elemento da array dentro do banco
          { new: true },
        )

        if (updateUser) {
          return res.status(200).json({})
        }

        return res.status(404).json({
          error:
            'Não foi possível remover o post do usuário pois este não foi encontrado.',
        })
      }

      return res.status(404).json({ error: 'Post não encontrado.' })
    } catch (err) {
      next(err)
    }
  },
)

//editar post
router.put(
  '/post/:id',
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const posting = await PostModel.findOne({ _id: id })

      if (String(req.currentUser._id) !== String(posting.userId)) {
        return res.status(401).json({})
      }

      const updatedPosting = await PostModel.findOneAndUpdate(
        { _id: id },
        { $set: { ...req.body } },
        { new: true, runValidators: true },
      )

      if (updatedPosting) {
        return res.status(200).json(updatedPosting)
      }

      return res.status(404).json({ error: 'Post não encontrado' })
    } catch (err) {
      next(err)
    }
  },
)

module.exports = router
