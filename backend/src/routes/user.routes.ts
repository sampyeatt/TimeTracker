import {Router} from 'express'
import {addUserController, getAllUsersController, getUserController} from '../controllers/user.controller'
import {authenticateJWT} from '../shared/auth.util'

const router = Router()

router.get('/allUsers', getAllUsersController)
router.get('/user', getUserController)
router.post('/', authenticateJWT, addUserController)

export default router