import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLogoChoreography,
  validateLeadInput,
} from './scrollMath';

test('Hero stage starts with the 3D T emblem dead-center on dark stage', () => {
  const hero = computeLogoChoreography(0);
  assert.equal(hero.stageIndex, 0);
  assert.equal(hero.x, 0);
  assert.equal(hero.whiteStageBlend, 0);
  assert.equal(hero.isLogoDocked, false);
  assert.equal(hero.activeCardSide, 'center');
});

test('Slalom stages dodge left and right opposite to the active text cards', () => {
  const stage1 = computeLogoChoreography(0.18);
  assert.equal(stage1.stageIndex, 1);
  assert.equal(stage1.activeCardSide, 'right');
  assert.ok(stage1.x < -1.5, `Expected emblem on left when card is right, got x=${stage1.x}`);

  const stage2 = computeLogoChoreography(0.31);
  assert.equal(stage2.stageIndex, 2);
  assert.equal(stage2.activeCardSide, 'left');
  assert.ok(stage2.x > 1.5, `Expected emblem on right when card is left, got x=${stage2.x}`);

  const stage3 = computeLogoChoreography(0.44);
  assert.equal(stage3.stageIndex, 3);
  assert.equal(stage3.activeCardSide, 'right');
  assert.ok(stage3.x < -1.5, `Expected emblem on left when card is right, got x=${stage3.x}`);

  const stage4 = computeLogoChoreography(0.55);
  assert.equal(stage4.stageIndex, 4);
  assert.equal(stage4.activeCardSide, 'left');
  assert.ok(stage4.x > 1.5, `Expected emblem on right when card is left, got x=${stage4.x}`);
});

test('White stage transitions background, reveals E-X-O-R-A, and docks the T emblem in place', () => {
  const preLock = computeLogoChoreography(0.65);
  assert.ok(preLock.whiteStageBlend > 0.3 && preLock.whiteStageBlend < 1);

  const locked = computeLogoChoreography(0.82);
  assert.equal(locked.stageIndex, 6);
  assert.equal(locked.whiteStageBlend, 1);
  assert.equal(locked.letterRevealProgress, 1);
  assert.equal(locked.isLogoDocked, true);
  assert.ok(locked.x < -2.0, 'Docked T emblem sits at the initial T slot on the left of EXORA');
});

test('Lead validation rejects empty fields and accepts valid WhatsApp project inquiries', () => {
  const invalid = validateLeadInput({
    clientName: 'A',
    whatsappPhone: '123',
    companyOrBrand: '',
    systemCategory: 'pharmacy-retail-erp',
    projectSummary: 'قصير',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.clientName);
  assert.ok(invalid.errors.whatsappPhone);
  assert.ok(invalid.errors.companyOrBrand);
  assert.ok(invalid.errors.projectSummary);

  const valid = validateLeadInput({
    clientName: 'د. محمد العتيبي',
    whatsappPhone: '+201012345678',
    companyOrBrand: 'صيدليات الشفاء الحديث',
    systemCategory: 'pharmacy-retail-erp',
    projectSummary: 'نحتاج نظام إدارة سلسلة صيدليات متكامل مع الفاتورة الإلكترونية وبوت واتساب للطلبات.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
