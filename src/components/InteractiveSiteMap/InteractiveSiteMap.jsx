// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, RefreshCw, ExternalLink, RotateCcw, Maximize2, User, MapPin, TrendingUp, Factory } from 'lucide-react';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { getPlotData } from '../../services/dataService';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

// NOTE: This file was accidentally truncated in a previous commit.
// Full file restored from commit 2d3bb66 with Building2 replaced by Factory.
// Please restore the full InteractiveSiteMap.jsx from git history commit 2d3bb66
// and apply: sed 's/Building2/Factory/g'
