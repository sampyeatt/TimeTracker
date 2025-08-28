import {Router} from 'express'
import {
    addNewTimeController, deleteTimeController,
    getTimeByTimeIdController,
    getTimeByUserIdController, stopAllTimeController, updateTimeController
} from '../controllers/time.controller'

const router = Router()

router.get('/byUserId/:userId', getTimeByUserIdController)
router.get('/byTimeId/:timeId', getTimeByTimeIdController)
router.post('/newTime', addNewTimeController)
router.put('/updateTime', updateTimeController)
router.put('/stopTime', stopAllTimeController)
router.delete('/deleteTime/:timeId', deleteTimeController)


export default router