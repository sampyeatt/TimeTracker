import {Router} from 'express'
import {
    addNewTimeController,
    getTimeByTimeIdController,
    getTimeByUserIdController, updateTimeController
} from '../controllers/time.controller'

const router = Router()

router.get('/byUserId/:userId', getTimeByUserIdController)
router.get('/byTimeId/:timeId', getTimeByTimeIdController)
router.post('/newTime', addNewTimeController)
router.put('/updateTime', updateTimeController)


export default router