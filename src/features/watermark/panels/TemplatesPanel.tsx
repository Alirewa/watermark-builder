// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Plus, Trash2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const MODE_LABELS: Record<string, string> = {
  text: 'متن',
  image: 'تصویر',
  qr: 'QR',
};

const MODE_COLORS: Record<string, 'default' | 'success' | 'info'> = {
  text: 'default',
  image: 'success',
  qr: 'info',
};

export function TemplatesPanel() {
  const { templates, saveTemplate, deleteTemplate, applyTemplate } = useWatermarkStore();
  const { toast } = useToast();
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSave = () => {
    const name = newName.trim();
    if (!name) { toast.error('نام قالب را وارد کنید'); return; }
    saveTemplate(name);
    toast.success('قالب ذخیره شد', name);
    setNewName('');
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">قالب‌ها</p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      {/* Save form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="نام قالب..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={handleSave} className="shrink-0 h-8">
                ذخیره
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates list */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <BookMarked className="size-8 opacity-30" />
          <p className="text-xs text-center">قالبی ذخیره نشده<br />تنظیمات فعلی را ذخیره کنید</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence>
            {templates.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <GlassCard className="flex items-center gap-2 p-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{t.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant={MODE_COLORS[t.mode] ?? 'default'} className="text-[10px] py-0 h-4 px-1.5">
                        {MODE_LABELS[t.mode]}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => { applyTemplate(t.id); toast.success('قالب اعمال شد', t.name); }}
                    className="rounded-lg shrink-0 text-primary"
                  >
                    <Zap className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => { deleteTemplate(t.id); toast.info('قالب حذف شد'); }}
                    className="rounded-lg shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
