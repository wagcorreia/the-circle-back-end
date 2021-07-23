const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
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
      const { title, description, terapiesfinding, userId } = req.body

      const loggedInUser = req.currentUser

      const newPost = await PostModel.create({
        userId: loggedInUser._id,
        title: title,
        description: description,
        terapiesfinding: terapiesfinding,
      })
      console.log(newPost)

      const updatePost = await PostModel.findOneAndUpdate(
        { _id: userId },
        { $push: { postID: newPost._id } },
      )
      if (updatePost) {
        return res.status(200).json(updatePost)
      }
      return res.status(201).json(updatePost)
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
      const post = await PostModel.findOne({ _id: id })

      // Deletar post do banco
      const deletepost = await PostModel.deleteOne({
        _id: id,
      })

      if (deletepost.n > 0) {
        // Remover o id da lista de referências do usuário
        const updateUser = await UserModel.findOneAndUpdate(
          { _id: post.userId },
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

module.exports = router
