'use strict'

const { CREATED, OK } = require('../core/success.response')
const blogService = require('../services/blog.service')

class BlogController {
  // POST
  createBlog = async (req, res, next) => {
    new CREATED({
      message: 'Create new blog success',
      metadata: await blogService.createBlog(req.body),
    }).send(res)
  }
  // PATCH update blog by id
  updateBlog = async (req, res, next) => {
    new OK({
      message: 'Update blog success',
      metadata: await blogService.updateBlog(req.params.id, req.body),
    }).send(res)
  }

  // Delete blog by id
  deleteBlog = async (req, res, next) => {
    new OK({
      message: 'Delete blog success',
      metadata: await blogService.deleteBlog(req.params.id),
    }).send(res)
  }

  // GET
  getListSearchBlog = async (req, res, next) => {
    new OK({
      message: 'Get list search blog success',
      metadata: await blogService.getListSearchBlog(req.params),
    }).send(res)
  }

  getAllBlogs = async (req, res, next) => {
    new OK({
      message: 'Get list all blog  success',
      metadata: await blogService.findAllBlogs(req.query),
    }).send(res)
  }

  getBlogBySlug = async (req, res, next) => {
    new OK({
      message: 'Get blog success',
      metadata: await blogService.findBlogBySlug({ slug: req.params.slug }),
    }).send(res)
  }
}

module.exports = new BlogController()
