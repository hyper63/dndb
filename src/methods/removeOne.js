import { mingo } from '../../deps.ts';
import { updateFile, ReadFileStream} from '../storage.ts';

export default async (filename, query) => {
  let stream = new ReadFileStream(filename);
  const queryMaker = new mingo.Query(query, {});
  let removed = [];
  let update = [];
  return new Promise((resolve, reject) => {
    stream.on('document', async obj => {
      if (queryMaker.test(obj) && !removed.length) removed.push(obj);
      update.push(obj) 
      if (removed.length && obj._id == removed[0]._id) update.pop()
    })
    stream.on('end', async () => {
      await updateFile(filename, update)
      return resolve(removed[0] || null);
    })
  })
}