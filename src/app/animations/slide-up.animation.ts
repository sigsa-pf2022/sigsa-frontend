import { createAnimation } from '@ionic/core';

export function slideUpAnimation(_: HTMLElement, opts: any) {
  const isBack = opts.direction === 'back';

  if (isBack) {
    // Create page slides down out; list page restores underneath
    const leaveAnim = createAnimation()
      .addElement(opts.leavingEl)
      .beforeStyles({ 'z-index': '10' })
      .afterClearStyles(['z-index'])
      .duration(320)
      .easing('cubic-bezier(0.32, 0.72, 0, 1)')
      .fromTo('transform', 'translateY(0%)', 'translateY(100%)')
      .fromTo('opacity', '1', '0.85');

    const enterAnim = createAnimation()
      .addElement(opts.enteringEl)
      .beforeStyles({ 'z-index': '1' })
      .afterClearStyles(['z-index'])
      .duration(320)
      .easing('cubic-bezier(0.32, 0.72, 0, 1)')
      .fromTo('transform', 'scale(0.97)', 'scale(1)')
      .fromTo('opacity', '0.6', '1');

    return createAnimation().addAnimation([leaveAnim, enterAnim]);
  }

  // List page scales back; create page slides up on top
  const enterAnim = createAnimation()
    .addElement(opts.enteringEl)
    .beforeStyles({ 'z-index': '10' })
    .afterClearStyles(['z-index'])
    .duration(320)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)')
    .fromTo('opacity', '0.85', '1');

  const leaveAnim = createAnimation()
    .addElement(opts.leavingEl)
    .beforeStyles({ 'z-index': '1' })
    .afterClearStyles(['z-index'])
    .duration(320)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .fromTo('transform', 'scale(1)', 'scale(0.97)')
    .fromTo('opacity', '1', '0.6');

  return createAnimation().addAnimation([enterAnim, leaveAnim]);
}
