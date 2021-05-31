import { library } from '@fortawesome/fontawesome-svg-core';

//этот вариант загружает только необходимые иконки
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faTrashRestoreAlt } from '@fortawesome/free-solid-svg-icons/faTrashRestoreAlt';
import { faTrashRestore } from '@fortawesome/free-solid-svg-icons/faTrashRestore';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons/faFileSignature';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFileVideo } from '@fortawesome/free-solid-svg-icons/faFileVideo';
import { faFileAudio } from '@fortawesome/free-solid-svg-icons/faFileAudio';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faChartArea } from '@fortawesome/free-solid-svg-icons/faChartArea';
import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { faQrcode } from '@fortawesome/free-solid-svg-icons/faQrcode';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import { faToolbox } from '@fortawesome/free-solid-svg-icons/faToolbox';
import { faColumns } from '@fortawesome/free-solid-svg-icons/faColumns';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons/faWindowClose';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown';
import { faDesktop } from '@fortawesome/free-solid-svg-icons/faDesktop';
import { faClone } from '@fortawesome/free-solid-svg-icons/faClone';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons/faPlayCircle';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons/faPenAlt';
import { faFileExport } from '@fortawesome/free-solid-svg-icons/faFileExport';
import { faFileImport } from '@fortawesome/free-solid-svg-icons/faFileImport';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons/faLockOpen';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons/faAddressBook';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';


//этот вариант все равно включает все иконки в бандл, может в следующих версиях webpack сделают
/*
import {    faQuestion, faQuestionCircle, faTrashAlt, faTrash, faTrashRestoreAlt, faTrashRestore, faDownload, faFileArchive, faTimes, 
            faPlus, faUpload, faFileSignature, faCheck, faCheckDouble, faCheckCircle, faSave,
            faItalic, faSearch, faEye, faEyeSlash, faEllipsisH, faEllipsisV,
            faFile, faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo, faFileAudio,   
            faEdit, faPencilAlt,
            faChevronUp, faChevronDown, faChevronLeft, faChevronRight,
            faChevronCircleUp, faChevronCircleDown,
            faCheckSquare, faSquare,
            faCog, faCogs,
            faChartLine, faChartBar, faChartArea, faChartPie, 
            faQrcode, faBarcode,
            faToolbox,
            faColumns,
            faBook,
            faBars,
            faHome,
            faUser, faUsers,
            faWindowClose,
            faThumbtack,
            faExclamation, faExclamationTriangle, faExclamationCircle, 
            faBolt,
            faAngleDown, faAngleRight, faAngleDoubleLeft, faAngleDoubleDown,
            faDesktop, 
            faClone, 
            faTable, 
            faLaptop, 
            faKey, 
            faPlayCircle, 
            faDatabase, 
            faEnvelope, 
            faFilter, 
            faFileAlt, 
            faPenAlt,
            faFileExport, faFileImport,
            faInfo, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
*/

library.add(
    faQuestion,         //вопрос
    faQuestionCircle,   //вопрос в кружке 
    faTrash,            //корзина конус
    faTrashAlt,         //корзина цилиндр
    faTrashRestore,     //корзина со стрелкой наверх конус 
    faTrashRestoreAlt,  //корзинасо стрелкой вверх цилиндр
    faDownload,         //стрелка в системный блок
    faFileArchive,      //документ застежкой молнией
    faTimes,            //крест
    faPlus,             //плюс
    faUpload,           //системный блок со стрелкой вверх
    faFileSignature,    //документ с карандашом рисующем на нем подпись
    faCheck,            //галочка
    faCheckDouble,      //двойная галочка
    faCheckCircle,      //галочка в кружочке
    faSave,             //дискета,
    faItalic,           //наклоненая
    faSearch,           //лупа I 
    faEye,              //глаз
    faEyeSlash,         //зачеркнутый глаз
    faEllipsisH,        //горизонтальные три точки
    faEllipsisV,        //вертикальные три точки
    faFile, faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo, faFileAudio,  //типы файлов
    faEdit,             //карандаш над листочком
    faPencilAlt,        //карандаш
    faChevronUp, faChevronDown, faChevronLeft, faChevronRight, faChevronCircleUp, faChevronCircleDown, //шевроны
    faCheckSquare, faSquare,    //квадрат, галка
    faCog,              //шестеренка
    faCogs,              //шестеренки
    faChartLine, faChartBar, faChartArea, faChartPie,   //графики
    faQrcode, faBarcode,    //коды
    faToolbox,          //ящик с инструментами
    faColumns,          //колонки таблицы
    faBook,             //книга
    faBars,             //гамбургер
    faHome,             //дом
    faUser,             //пользователь
    faUsers,            //пользователи
    faWindowClose,      //закрыть - крестик в квадратике
    faThumbtack,        //кнопка-заколка
    faExclamation, faExclamationTriangle, faExclamationCircle,  //восклицательные знаки (простой, в треугольнике, в круге)
    faBolt,             //молния
    faAngleUp, faAngleDown, faAngleRight, faAngleDoubleLeft, faAngleDoubleDown,    //одиночный шевров в разные стороны
    faDesktop,          //монитор
    faClone,            //квадратик над квадратиком, похож на copy, но без уголочков документов
    faTable,            //таблица, с шапкой и 4-я ячейками
    faLaptop,           //ноутбук
    faKey,              //ключ
    faPlayCircle,       //значек play в кружочке
    faDatabase,         //стопка дисков друг над другом
    faEnvelope,         //конверт
    faFilter,           //воронка
    faFileAlt,          //документ с уголочком
    faPenAlt,           //еще один карандаш
    faFileExport, faFileImport,      //документ со стрелкой в него или из него 
    faInfo, faInfoCircle,            //буква i (инфо, простая и в кружочке),
    faUndo,                          //стрелка согнутая в круг
    faPaperclip,                      //скрепка
    faPrint,            //принтер
    faLock, faLockOpen,              //замки
    faAddressBook,      //адрессная книга
    faSyncAlt,          //кружок со стрелочками, refresh, reload
);  
