import {Router} from 'express'
import {
    getUserRoleController,
    registerController
} from '../controllers/auth.controller'
import {authenticateJWT} from '../shared/auth.util'

const router = Router()

router.get('/role/:userId', authenticateJWT, getUserRoleController)
router.post('/register', registerController)

export default router