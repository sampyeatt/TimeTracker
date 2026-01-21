import {Router} from 'express'
import {addUserController, getAllUsersController, getUserController} from '../controllers/user.controller'

const router = Router()

router.get('/allUsers', getAllUsersController)
router.get('/user', getUserController)
router.post('/', addUserController)

export default router