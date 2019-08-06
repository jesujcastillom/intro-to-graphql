import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

function products() {
  return Product.find({}).exec()
}

function product(_, { id }, ctx, info) {
  return Product.findById(id).exec()
}

function newProduct(_, { input: product }, { user }, info) {
  return new Product({ ...product, createdBy: user }).save()
}

function updateProduct(_, { id, input: update }, ctx, info) {
  return Product.findOneAndUpdate({ _id: id }, update, { new: true }).exec()
}

function removeProduct(_, { id }, ctx, info) {
  return Product.findOneAndDelete({ _id: id }).exec()
}

export default {
  Query: {
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy({ createdBy: id }, args, ctx, info) {
      return User.findById(id).exec()
    }
  }
}
