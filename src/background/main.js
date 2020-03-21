import 'chrome-extension-async';

import { updateActionIcon } from './updateActionIcon';
import { generateData } from './data';
import { startMiddleware } from './middleware';
import { enableBmBar } from './insertAndToggleBmBar';

updateActionIcon();
generateData();
startMiddleware();
enableBmBar();
