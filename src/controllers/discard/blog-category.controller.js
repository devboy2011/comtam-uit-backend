'use strict'

const { CREATED, OK } = require('../core/success.response')
const blogCategoryService = require('../services/blog-category.services')

class BlogCategoryController {
  // POST
  createBlogCategory = async (req, res, next) => {
    new CREATED({
      message: 'Create new blog category success',
      metadata: await blogCategoryService.createBlogCategory(req.body),
    }).send(res)
  }

  // PATCH update blogCategory by id
  updateBlogCategory = async (req, res, next) => {
    new OK({
      message: 'Update blog Category success',
      metadata: await blogCategoryService.updateBlogCategory(req.params.id, req.body),
    }).send(res)
  }

  // Delete blogCategory by id
  deleteBlogCategory = async (req, res, next) => {
    new OK({
      message: 'Delete blog Category success',
      metadata: await blogCategoryService.deleteBlogCategory(req.params.id),
    }).send(res)
  }

  // GET
  getBlogCategoryBySlug = async (req, res, next) => {
    new OK({
      message: 'Get blog category success',
      metadata: await blogCategoryService.findBlogCategoryBySlug({
        slug: req.params.slug,
      }),
    }).send(res)
  }
  getAllBlogCategories = async (req, res, next) => {
    new OK({
      message: 'Get all blog categories success',
      metadata: await blogCategoryService.findAllBlogCategories(req.query),
    }).send(res)
  }
}

module.exports = new BlogCategoryController()
