import fs from 'fs';
import path from 'path';
import uploadingConfig from '@config/upload';

import IStorageProvider from "../models/IStorageProvider";

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string>{
    // rename -> mover um arquivo de um lado para outro
    await fs.promises.rename(
      path.resolve(uploadingConfig.directory,file),
      path.resolve(uploadingConfig.uploadsFolder, file),
    )

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadingConfig.uploadsFolder,file);

    try {
      // stat traz informações do arquivo
      await fs.promises.stat(filePath);
    } catch {
      return;
    }  
    // unlink deletar o arquivo
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;