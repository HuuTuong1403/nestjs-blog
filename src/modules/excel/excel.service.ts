import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { data } from 'src/data';
import { Workbook, Worksheet } from 'exceljs';
import * as tmp from 'tmp';
import { writeFile } from 'fs/promises';

@Injectable()
export class ExcelService {
  private stylesheet(sheet: Worksheet) {
    // Set width of each column
    sheet.getColumn(1).width = 20.5;
    sheet.getColumn(2).width = 20.5;

    // Set height of header
    sheet.getRow(1).height = 30.5;

    // Set font color
    sheet.getRow(1).font = {
      size: 11.5,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    // Set background color
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: '000000' },
      fgColor: { argb: '000000' },
    };

    // Set alignments
    sheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    // Set borders
    sheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
  }

  async downloadExcel() {
    if (!data) {
      throw new NotFoundException('No data to download');
    }

    let rows = [];

    data.forEach((doc) => {
      rows.push(Object.values(doc));
    });

    // Create a workbook
    let book = new Workbook();

    // Add worksheet to workbook
    let sheet = book.addWorksheet(`sheet1`);

    // Add header
    rows.unshift(Object.keys(data[0]));

    // Add multiple rows in the sheet
    sheet.addRows(rows);

    // Add style sheet
    this.stylesheet(sheet);

    let File = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: `MyExcelSheet`,
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            throw new BadRequestException(err);
          }

          book.xlsx
            .writeFile(file)
            .then((_) => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
            });
        },
      );
    });
    console.log('ExcelService => File', File);

    return File;
  }
}
