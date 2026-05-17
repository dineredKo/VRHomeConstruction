import { put, takeEvery, select } from 'typed-redux-saga';
import { actions } from './slice';
import { selectors } from './selectors';
import { Opening } from './types';

function* handleCreateOpeningSaga(action: ReturnType<typeof actions.createOpeningRequested>) {
  const { wallId, point } = action.payload;
  const activeTool = yield* select(selectors.selectActiveTool);
  const type = activeTool === 'window' ? 'window' : 'door';

  const opening: Opening = {
    id: `${type}_${Date.now()}`,
    wallId,
    type,
    position: [point.x, point.y],
    width: 0.8,
    height: type === 'door' ? 2.1 : 1.2,
  };

  const partitions = yield* select(selectors.selectPartitions);
  const isPartition = partitions.some(p => p.id === wallId);

  if (isPartition) {
    yield put(actions.addOpeningToPartition({ partitionId: wallId, opening }));
  } else {
    yield put(actions.addOpening({ wallId, opening }));
  }

  yield put(actions.setActiveTool('select'));
}

function* handleDeleteOpeningSaga(action: ReturnType<typeof actions.deleteOpeningRequested>) {
  const { openingId } = action.payload;
  const openings = yield* select(selectors.selectOpenings);
  const partitions = yield* select(selectors.selectPartitions);

  let found = false;
  for (const key in openings) {
    if (openings[key].some((o: Opening) => o.id === openingId)) {
      yield put(actions.removeOpening({ wallId: key, openingId }));
      found = true;
      break;
    }
  }

  if (!found) {
    for (const p of partitions) {
      if (p.openings.some(o => o.id === openingId)) {
        yield put(actions.removeOpeningFromPartition({ partitionId: p.id, openingId }));
        break;
      }
    }
  }

  yield put(actions.setSelectedOpening(null));
}

export function* initSaga() {
  yield takeEvery(actions.createOpeningRequested.type, handleCreateOpeningSaga);
  yield takeEvery(actions.deleteOpeningRequested.type, handleDeleteOpeningSaga);
}