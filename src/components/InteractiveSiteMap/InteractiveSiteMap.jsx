// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, RefreshCw, ExternalLink, RotateCcw, Maximize2, User, MapPin, TrendingUp, Factory } from 'lucide-react';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { getPlotData } from '../../services/dataService';