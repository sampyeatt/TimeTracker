import {Router} from 'express'
import {
    addNewTimeController, deleteTimeController,
    getTimeByTimeIdController,
    getTimeByUserIdController, resetAllTimeController, stopAllTimeController, updateTimeController
} from '../controllers/time.controller'
import {authenticateJWT} from '../shared/auth.util'

const router = Router()

router.get('/byUserId/:userId', authenticateJWT, getTimeByUserIdController)
router.get('/byTimeId/:timeId', authenticateJWT, getTimeByTimeIdController)
router.post('/newTime', authenticateJWT, addNewTimeController)
router.put('/updateTime', authenticateJWT, updateTimeController)
router.put('/stopTime', authenticateJWT, stopAllTimeController)
router.put('/resetTime', authenticateJWT, resetAllTimeController)
router.delete('/deleteTime/:timeId', authenticateJWT, deleteTimeController)


export default router