import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const authorized = user => {
  if (!user) {
    throw new AuthenticationError();
  }
}

const adminRole = user => {
  authorized(user);
  if (user.role !== 'admin') {
    throw new AuthenticationError();
  }
}

/** product */
const product = (_, args, { user }) => {
  authorized(user);
  return Product.findById(args.id)
    .lean()
    .exec()
}

const newProduct = (_, args, { user }) => {
  adminRole(user);
  return Product.create({ ...args.input, createdBy: user._id })
}

const products = (_, args, { user }) => {
  authorized(user);
  return Product.find({})
    .lean()
    .exec()
}

const updateProduct = (_, args, { user }) => {
  adminRole(user);
  const update = args.input
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, { user }) => {
  adminRole(user);
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
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
    __resolveType(product) {
      return productsTypeMatcher[product.type]
    },
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
