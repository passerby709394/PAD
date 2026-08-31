/**
 * Created by 六一 on 2026-08-10 12:50:19.
 * HP 动画管理类（单例风格，全部静态）
 * 负责管理所有战斗者的 HP 平滑变化动画，支持队列串行执行。
 */
class PADanim {
    // 存储每个战斗者的动画状态：队列、是否动画中、定时器ID、动画长度
    private static _animDataMap = new Map<
        Batter,
        {
            queue: Array<{ change: number; duration: number; onComplete: () => void }>;
            isAnimating: boolean;
            ticker: number | null;            
        }
    >();

    // 界面1004（伤害字体）text 组件模板缓存：字体属性全部通过可视化编辑界面1004的text组件调整
    private static _textTemplate: UIString = null;

    // 玩家攻击阶段累计的伤害（按目标敌人分组），用于攻击结束后一次性显示每个敌人的总伤害数字
    private static _pendingDamage = new Map<Batter, number>();

    // 全局飘字淡出计数：当前仍在淡出的飘字数量；为 0 时触发等待回调
    private static _activeFloatingCount = 0;
    private static _floatingWaitCallbacks: Array<() => void> = [];

    // 玩家攻击阶段：是否为最后一次受击（最后一次才播放被攻击动作，避免连续多次受击重复播放）
    private static _isLastHit: boolean = true;

    /**
     * 启动或加入一个战斗者的 HP 变化动画
     * @param batter       目标战斗者
     * @param change       HP 变化量（正为治疗，负为扣血）
     * @param duration     动画持续时长（毫秒）
     * @param onComplete   动画结束后的回调（可选）
     */
    static startHpAnimation(
        batter: Batter,
        change: number,
        duration: number,
        onComplete:Function
    ) {
        // 获取或创建该战斗者的动画状态
        let data = this._animDataMap.get(batter);
        if (!data) {
            data = { queue: [], isAnimating: false, ticker: null };
            this._animDataMap.set(batter, data);
        }

        // 将新变化加入队列
        data.queue.push({
            change,
            duration,
            onComplete: () => { onComplete && onComplete(); }
        });

        // 如果当前没有正在执行的动画，则立刻开始消费队列
        if (!data.isAnimating) {
            this._runNext(batter);
        }
    }

    /**
     * 玩家攻击准备动画
     * @param player       玩家战斗者
     * @param change       HP 变化量（正数）
     * @param now          马上完成数值跳动
     * @param onComplete   动画结束后的回调（可选）
     */
    static playerAtkPR(player: Batter, change: number, now:boolean=false,onComplete?: Function): void {
        let atkAniPRid=GameData.getModuleData(2,player.actor.ElementType1).ani ;
        if (!player.atkAniPR) {
            player.atkAniPR = new GCAnimation();
            player.atkAniPR.id = atkAniPRid;
            PADBattle.battleUI.addChild(player.atkAniPR);
            // 每次播放完都隐藏
            player.atkAniPR.on(GCAnimation.PLAY_COMPLETED, this, () => {
                player.atkAniPR.visible = false;
            });
        }
        // 定位到卡图位置
        player.atkAniPR.x = player.cardImage.x;
        player.atkAniPR.y = player.cardImage.y;
        // 重新显示并从第1帧开始播放一次
        player.atkAniPR.visible = true;
        player.atkAniPR.gotoAndPlay(1);

        // ===== 伤害/治疗数值动画 =====
        // 懒加载界面1004的text组件作为字体模板（字体属性通过可视化编辑界面1004调整）
        if (!this._textTemplate) {
            let ui1004: GUI_1004 = GameUI.load(1004) as GUI_1004;
            if (ui1004) this._textTemplate = ui1004.text;
        }
        // 创建文本组件，完整复制模板（界面1004的text）的属性
        if (!player.atkAniPRtext) {
            player.atkAniPRtext = new UIString();
            if (this._textTemplate) {
                player.atkAniPRtext.width = this._textTemplate.width;
                player.atkAniPRtext.height = this._textTemplate.height;
                player.atkAniPRtext.fontSize = this._textTemplate.fontSize;
                player.atkAniPRtext.bold = this._textTemplate.bold;
                player.atkAniPRtext.italic = this._textTemplate.italic;
                player.atkAniPRtext.smooth = this._textTemplate.smooth;
                player.atkAniPRtext.leading = this._textTemplate.leading;
                player.atkAniPRtext.letterSpacing = this._textTemplate.letterSpacing;
                player.atkAniPRtext.font = this._textTemplate.font;
                player.atkAniPRtext.wordWrap = this._textTemplate.wordWrap;
                player.atkAniPRtext.overflow = this._textTemplate.overflow;
                player.atkAniPRtext.align = this._textTemplate.align;
                player.atkAniPRtext.valign = this._textTemplate.valign;
                player.atkAniPRtext.shadowEnabled = this._textTemplate.shadowEnabled;
                player.atkAniPRtext.shadowColor = this._textTemplate.shadowColor;
                player.atkAniPRtext.shadowDx = this._textTemplate.shadowDx;
                player.atkAniPRtext.shadowDy = this._textTemplate.shadowDy;
                player.atkAniPRtext.stroke = this._textTemplate.stroke;
                player.atkAniPRtext.strokeColor = this._textTemplate.strokeColor;
            }
            PADBattle.battleUI.addChild(player.atkAniPRtext);
        }
        // 字体颜色 = 元素属性文本颜色（数据驱动）
        player.atkAniPRtext.color = GameData.getModuleData(2, player.actor.ElementType1).textColor;
        // 显示在卡图上方60像素
        player.atkAniPRtext.x = player.cardImage.x;
        player.atkAniPRtext.y = player.cardImage.y - 60;
        player.atkAniPRtext.visible = true;

        // 清除旧的数字动画定时器（防止重复播放时重叠）
        if (player._atkTextTicker) {
            clearInterval(player._atkTextTicker);
            player._atkTextTicker = null;
        }

        // 初始值：组件不存在（首次创建、文本为空）时为0；组件已存在则复用其当前显示值
        let initValue = parseInt(player.atkAniPRtext.text, 10) || 0;
        const targetValue = initValue + change; // 终值 = 初始值 + change
        player.atkAniPRtext.text = String(initValue);

        // 在攻击动画长度的时间内，数字从初始值匀速变化到终值（每帧变化量为整数）
        const fps = player.atkAniPR.fps || Config.ANIMATION_FPS;
        const animDuration = player.atkAniPR.totalFrame / fps * 1000; // 攻击动画时长（毫秒）
        const frameInterval = 50; // 帧间隔
        let totalFrames = Math.max(1, Math.round(animDuration / frameInterval));
        let currentValue = initValue;
        let remain = change; // 剩余需要变化的值
        if(now)totalFrames = 1;
        player._atkTextTicker = setInterval(() => {
            // 核心：step 取整数，避免显示小数；剩余不足一步时直接跳到终点
            let step: number;
            if (Math.abs(remain) <= Math.ceil(change / totalFrames)) {
                step = remain;
            } else {
                step = Math.ceil(change / totalFrames);
            }
            currentValue += step;
            remain -= step;
            player.atkAniPRtext.text = String(currentValue);
            // 动画结束：隐藏文本，执行回调
            if (remain <= 0) {
                clearInterval(player._atkTextTicker);
                player._atkTextTicker = null;
                
                onComplete?.();
                return;
            }
        }, frameInterval);
    }

    /**
     * 玩家治疗准备动画
     * @param player       玩家战斗者
     * @param change       治疗量（正数）
     * @param healElementID 治疗元素数据ID
     * @param now          马上完成数值跳动
     * @param onComplete   动画结束后的回调（可选）
     */
    static playerHealPR(player: Batter, change: number, healElementID:number,now:boolean=false,onComplete?: Function): void {
        let healAniPRid=GameData.getModuleData(2,healElementID).ani ;
        if (!player.healAniPR) {
            player.healAniPR = new GCAnimation();
            player.healAniPR.id = healAniPRid;
            PADBattle.battleUI.addChild(player.healAniPR);
            // 每次播放完都隐藏
            player.healAniPR.on(GCAnimation.PLAY_COMPLETED, this, () => {
                player.healAniPR.visible = false;
            });
        }
        // 定位到卡图位置
        player.healAniPR.x = player.cardImage.x;
        player.healAniPR.y = player.cardImage.y;
        // 重新显示并从第1帧开始播放一次
        player.healAniPR.visible = true;
        player.healAniPR.gotoAndPlay(1);

        // ===== 治疗数值动画 =====
        // 懒加载界面1004的text组件作为字体模板（字体属性通过可视化编辑界面1004调整）
        if (!this._textTemplate) {
            let ui1004: GUI_1004 = GameUI.load(1004) as GUI_1004;
            if (ui1004) this._textTemplate = ui1004.text;
        }
        // 创建文本组件，完整复制模板（界面1004的text）的属性
        if (!player.healAniPRtext) {
            player.healAniPRtext = new UIString();
            if (this._textTemplate) {
                player.healAniPRtext.width = this._textTemplate.width;
                player.healAniPRtext.height = this._textTemplate.height;
                player.healAniPRtext.fontSize = this._textTemplate.fontSize-8;
                player.healAniPRtext.bold = this._textTemplate.bold;
                player.healAniPRtext.italic = this._textTemplate.italic;
                player.healAniPRtext.smooth = this._textTemplate.smooth;
                player.healAniPRtext.leading = this._textTemplate.leading;
                player.healAniPRtext.letterSpacing = this._textTemplate.letterSpacing;
                player.healAniPRtext.font = this._textTemplate.font;
                player.healAniPRtext.wordWrap = this._textTemplate.wordWrap;
                player.healAniPRtext.overflow = this._textTemplate.overflow;
                player.healAniPRtext.align = this._textTemplate.align;
                player.healAniPRtext.valign = this._textTemplate.valign;
                player.healAniPRtext.shadowEnabled = this._textTemplate.shadowEnabled;
                player.healAniPRtext.shadowColor = this._textTemplate.shadowColor;
                player.healAniPRtext.shadowDx = this._textTemplate.shadowDx;
                player.healAniPRtext.shadowDy = this._textTemplate.shadowDy;
                player.healAniPRtext.stroke = this._textTemplate.stroke;
                player.healAniPRtext.strokeColor = this._textTemplate.strokeColor;
            }
            PADBattle.battleUI.addChild(player.healAniPRtext);
        }
        // 字体颜色 = 元素属性文本颜色（数据驱动）
        player.healAniPRtext.color = GameData.getModuleData(2, healElementID).textColor;
        // 显示在卡图上方？像素
        player.healAniPRtext.x = player.cardImage.x;
        player.healAniPRtext.y = player.cardImage.y - 60-2-player.healAniPRtext.fontSize;
        player.healAniPRtext.visible = true;

        // 清除旧的数字动画定时器（防止重复播放时重叠）
        if (player._healTextTicker) {
            clearInterval(player._healTextTicker);
            player._healTextTicker = null;
        }

        // 初始值：组件不存在（首次创建、文本为空）时为0；组件已存在则复用其当前显示值
        let initValue = parseInt(player.healAniPRtext.text, 10) || 0;
        const targetValue = initValue + change; // 终值 = 初始值 + change
        player.healAniPRtext.text = String(initValue);

        // 在治疗动画长度的时间内，数字从初始值匀速变化到终值（每帧变化量为整数）
        const fps = player.healAniPR.fps || Config.ANIMATION_FPS;
        const animDuration = player.healAniPR.totalFrame / fps * 1000; // 治疗动画时长（毫秒）
        const frameInterval = 50; // 帧间隔
        let totalFrames = Math.max(1, Math.round(animDuration / frameInterval));
        let currentValue = initValue;
        let remain = change; // 剩余需要变化的值
        if(now)totalFrames = 1;
        player._healTextTicker = setInterval(() => {
            // 核心：step 取整数，避免显示小数；剩余不足一步时直接跳到终点
            let step: number;
            if (Math.abs(remain) <= Math.ceil(change / totalFrames)) {
                step = remain;
            } else {
                step = Math.ceil(change / totalFrames);
            }
            currentValue += step;
            remain -= step;
            player.healAniPRtext.text = String(currentValue);
            // 动画结束：隐藏文本，执行回调
            if (remain <= 0) {
                clearInterval(player._healTextTicker);
                player._healTextTicker = null;
                
                onComplete?.();
                return;
            }
        }, frameInterval);
    }
    
    /**
     * 玩家单体攻击：显示并循环播放攻击动画
     * 使用Tween将攻击动画移动到首个存活敌人行走图的中心点
     * 敌人扣除 atkAniPRtext 当前显示数值的HP，并播放敌人受击音效
     * 最后销毁攻击动画与数值文本
     * @param player 玩家战斗者
     * @param onAfterHit 扣血处理完毕后的回调（可选）
     */
    static playerSingleAtk(player: Batter, onAfterHit?: Function): void {
        // 找到第一个 HP 不为 0 的敌人
        let target: Batter = null;
        for (const enemy of Batter.enemys) {
            if (enemy.uihpSlider.value > 0) {
                target = enemy;
                break;
            }
        }
        // 动画/数值文本不存在：无法攻击，仍要触发回调，避免攻击链卡死
        if (!player.atkAniPR || !player.atkAniPRtext) { onAfterHit?.(); return; }

        // 清理可能残留的数值文本动画定时器（防止引用已销毁对象）
        if (player._atkTextTicker) {
            clearInterval(player._atkTextTicker);
            player._atkTextTicker = null;
        }

        // 没有存活敌人：无需播放攻击动画，仍要销毁数值文本与攻击动画，避免资源残留
        if (!target) {
            player.atkAniPRtext.dispose();
            player.atkAniPRtext = null;
            player.atkAniPR.dispose();
            player.atkAniPR = null;
            onAfterHit?.();
            return;
        }

        // 显示并循环播放攻击动画（loop=true 不触发 PLAY_COMPLETED）
        player.atkAniPR.visible = true;
        player.atkAniPR.loop = true;
        player.atkAniPR.gotoAndPlay(1);

        // 以动画自身中心为锚点
        player.atkAniPR.pivotX = player.atkAniPR.width / 2;
        player.atkAniPR.pivotY = player.atkAniPR.height / 2;
        // 使用Tween将攻击动画移动到敌人行走图中心点（考虑行走图缩放）
        const av = target.avatar;
        const targetX = av.x + av.width * av.scaleX / 2;
        const targetY = av.y + av.height * av.scaleY / 2;
        // 移动时长 = 攻击动画单轮时长（兜底200ms）
        const moveDuration = Math.max(200, player.atkAniPR.totalFrame / (player.atkAniPR.fps || Config.ANIMATION_FPS) * 1000);
        // 移动完成后销毁数值文本与攻击动画（不能立即销毁，否则看不到播放和移动）
        Tween.to(player.atkAniPR, { x: targetX, y: targetY }, moveDuration, null, Callback.New(() => {
            player.atkAniPRtext.dispose();
            player.atkAniPRtext = null;
            player.atkAniPR.dispose();
            player.atkAniPR = null;
        }, null));

        // 敌人扣血 = 数值文本当前显示值（取正数）
        const damage = Math.abs(parseInt(player.atkAniPRtext.text, 10) || 0);
        if (damage > 0) {
            // 最终伤害统一由 changeHP 内部通过 PADhelper.damageToEnemy 计算（避免重复计算）
            // HP变化动画时长 = 敌人行走图被攻击动作（动作ID9）的帧长换算毫秒
            let hpDuration = 1000; // 兜底
            const avatarObj = av.avatar;
            if (avatarObj && avatarObj.actionList) {
                const act9 = avatarObj.actionList.find((a) => a.id === 9);
                if (act9) {
                    const fps = av.avatarFPS || Config.ANIMATION_FPS;
                    hpDuration = act9.getFrameLength(5) / fps * 1000;
                }
            }
            // 扣血（changeHP 返回钩子计算后的最终伤害，用于累加显示）
            const finalDamage = target.changeHP(player, -damage, Math.max(100, hpDuration), player.actor.ElementType1, () => { onAfterHit?.(); });
            PADanim.accumulateDamage(target, Math.abs(finalDamage));
        } else {
            // 伤害为 0：无实际扣血，直接触发回调，避免攻击链卡死
            onAfterHit?.();
        }
        // 播放敌人受击音效
        if (target.actor.hitVoice) {
            GameAudio.playSE(target.actor.hitVoice);
        }
        
        
    }

    /**
     * 玩家全体攻击：为每个存活敌人复制一份攻击动画并循环播放
     * 每个副本使用Tween从玩家卡图移动到对应敌人行走图中心点
     * 所有存活敌人扣除 atkAniPRtext 当前显示数值的HP，并播放受击音效
     * 全部副本移动完成后销毁所有副本与数值文本
     * @param player 玩家战斗者
     * @param onAfterHit 扣血处理完毕后的回调（可选）
     */
    static playerAllAtk(player: Batter, onAfterHit?: Function): void {
        // 收集所有存活敌人（HP > 0）
        const targets: Batter[] = [];
        for (const enemy of Batter.enemys) {
            if (enemy.uihpSlider.value > 0) targets.push(enemy);
        }
        // 动画/数值文本不存在：无法攻击，仍要触发回调，避免攻击链卡死
        if (!player.atkAniPR || !player.atkAniPRtext) { onAfterHit?.(); return; }

        // 清理可能残留的数值文本动画定时器（防止引用已销毁对象）
        if (player._atkTextTicker) {
            clearInterval(player._atkTextTicker);
            player._atkTextTicker = null;
        }

        // 没有存活敌人：无需播放攻击动画，仍要销毁数值文本与攻击动画，避免资源残留
        if (targets.length <= 0) {
            player.atkAniPRtext.dispose();
            player.atkAniPRtext = null;
            player.atkAniPR.dispose();
            player.atkAniPR = null;
            onAfterHit?.();
            return;
        }

        // 副本动画参数：起始位置（玩家卡图）、动画ID、移动时长
        const startX = player.atkAniPR.x;
        const startY = player.atkAniPR.y;
        const aniID = player.atkAniPR.id;
        const moveDuration = Math.max(200, player.atkAniPR.totalFrame / (player.atkAniPR.fps || Config.ANIMATION_FPS) * 1000);
        // 全体伤害 = 数值文本当前显示值（取正数）
        const damage = Math.abs(parseInt(player.atkAniPRtext.text, 10) || 0);

        // 所有副本移动完成的计数，全部完成后销毁数值文本与原始动画
        let pendingCount = targets.length;
        const onCloneMoved = () => {
            if (--pendingCount <= 0) {
                player.atkAniPRtext.dispose();
                player.atkAniPRtext = null;
                player.atkAniPR.dispose();
                player.atkAniPR = null;
            }
        };

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            // 是否最后一个目标（其HP动画完成时触发 onAfterHit）
            const isLast = i === targets.length - 1;
            // 复制攻击动画（相同动画ID，复用已缓存资源），初始位于玩家卡图
            const clone = new GCAnimation();
            clone.id = aniID;
            PADBattle.battleUI.addChild(clone);
            // 以动画自身中心为锚点
            clone.pivotX = clone.width / 2;
            clone.pivotY = clone.height / 2;
            clone.x = startX;
            clone.y = startY;
            // 循环播放
            clone.visible = true;
            clone.loop = true;
            clone.gotoAndPlay(1);

            // 使用Tween将副本移动到该敌人行走图中心点（考虑行走图缩放），移动完成后销毁该副本
            const av = target.avatar;
            const targetX = av.x + av.width * av.scaleX / 2;
            const targetY = av.y + av.height * av.scaleY / 2;
            Tween.to(clone, { x: targetX, y: targetY }, moveDuration, null, Callback.New(() => {
                clone.dispose();
                onCloneMoved();
            }, null));

            // 该目标扣血（damage为0时无实际血量变化，changeHP会立即完成并触发回调）
            if (damage >= 0) {
                // 最终伤害统一由 changeHP 内部通过 PADhelper.damageToEnemy 计算（避免重复计算）
                // HP变化动画时长 = 敌人行走图被攻击动作（动作ID9）的帧长换算毫秒
                let hpDuration = 1000; // 兜底
                const avatarObj = av.avatar;
                if (avatarObj && avatarObj.actionList) {
                    const act9 = avatarObj.actionList.find((a) => a.id === 9);
                    if (act9) {
                        const fps = av.avatarFPS || Config.ANIMATION_FPS;
                        hpDuration = act9.getFrameLength(5) / fps * 1000;
                    }
                }
                // 扣血（changeHP 返回钩子计算后的最终伤害，用于累加显示）
                const finalDamage = target.changeHP(player, -damage, Math.max(100, hpDuration), player.actor.ElementType1, () => {
                    if (isLast) onAfterHit?.();
                });
                PADanim.accumulateDamage(target, Math.abs(finalDamage));
            }
            // 播放该敌人受击音效
            if (target.actor.hitVoice) {
                GameAudio.playSE(target.actor.hitVoice);
            }
        }
    }

    /**
     * 玩家队伍治疗：播放回复音效，所有有治疗准备的玩家治疗动画同时移动到队伍血条图片中心并消失
     * 销毁治疗数值文本，合计全部治疗量并增加到玩家队伍生命值
     * @param onAfterHeal 治疗处理完毕后的回调（可选）
     */
    static playerHeal(onAfterHeal?: Function): void {


        // 收集所有有治疗准备的玩家（healAniPR / healAniPRtext 均已创建）
        const healers: Batter[] = [];
        for (const p of Batter.players) {
            if (p.healAniPR && p.healAniPRtext) healers.push(p);
        }
        // 没有治疗准备的玩家：直接结束
        if (healers.length <= 0) {
            onAfterHeal?.();
            return;
        }
        // 播放回复音效
        GameAudio.playSE(PADElement.healSE);
        // 清理可能残留的数值文本动画定时器（防止引用已销毁对象）
        for (const p of healers) {
            if (p._healTextTicker) {
                clearInterval(p._healTextTicker);
                p._healTextTicker = null;
            }
        }

        // 合计所有玩家治疗量（文本当前显示值，取正数）
        let totalHeal = 0;
        for (const p of healers) {
            totalHeal += Math.abs(parseInt(p.healAniPRtext.text, 10) || 0);
        }

        // 治疗完成判定：治疗数字淡出 + 回血动画 都完成后才触发 onAfterHeal（避免与后续伤害数字重叠）
        let healHPDone = false;
        let healFadeDone = false;
        const tryFinishHeal = (): void => {
            if (healHPDone && healFadeDone) onAfterHeal?.();
        };

        // 治疗动画目标位置：队伍血条图片中心
        // 注意：hpImg 的 x/y 是其父容器的相对坐标，不能直接作为 Tween 目标（healAniPR 挂在 battleUI 下，用的是 battleUI 局部坐标）
        // 先取血条中心点（hpImg 本地坐标）转全局坐标，再转回 battleUI 局部坐标
        const hpImg = PADBattle.battleUI.PlayerHPimage;
        const centerInGlobal = hpImg.localToGlobal(new Point(hpImg.width / 2, hpImg.height / 2));
        const centerInUI = PADBattle.battleUI.globalToLocal(centerInGlobal);
        const targetX = centerInUI.x;
        const targetY = centerInUI.y;
        // 移动时长 = 首个玩家治疗动画单轮时长（兜底200ms）
        const moveDuration = Math.max(200, healers[0].healAniPR.totalFrame / (healers[0].healAniPR.fps || Config.ANIMATION_FPS) * 1000);

        // 所有玩家治疗动画同时移动到队伍血条中心，移动完成后销毁动画与数值文本
        for (const p of healers) {
            // 显示并循环播放治疗动画（loop=true 不触发 PLAY_COMPLETED）
            p.healAniPR.visible = true;
            p.healAniPR.loop = true;
            p.healAniPR.gotoAndPlay(1);
            // 以动画自身中心为锚点
            p.healAniPR.pivotX = p.healAniPR.width / 2;
            p.healAniPR.pivotY = p.healAniPR.height / 2;
            // 移动完成后销毁数值文本与治疗动画（不能立即销毁，否则看不到播放和移动）
            Tween.to(p.healAniPR, { x: targetX, y: targetY }, moveDuration, null, Callback.New(() => {
                p.healAniPRtext.dispose();
                p.healAniPRtext = null;
                p.healAniPR.dispose();
                p.healAniPR = null;
            }, null));
        }

        // 增加玩家队伍生命值（changeHP 返回钩子计算后的最终治疗值，用于飘字）
        if (totalHeal > 0) {
            const finalHeal = Batter.players[0].changeHP(Batter.players[0], totalHeal, Math.max(100, moveDuration), 0, () => {
                healHPDone = true;
                tryFinishHeal();
            });
            // 显示最终治疗数字（在队伍代表玩家上方），淡出后标记完成
            if (finalHeal > 0) {
                PADanim._showHealText(Batter.players[0], finalHeal, "#00ff00", () => {
                    healFadeDone = true;
                    tryFinishHeal();
                });
            } else {
                healFadeDone = true;
                tryFinishHeal();
            }
        } else {
            healHPDone = true;
            healFadeDone = true;
            tryFinishHeal();
        }
    }

    /**
     * 敌人攻击：播放释放动作（releaseActionID），动作完成后播放对应元素的攻击动画（循环）
     * 并移动到玩家队伍血条中心，到达后销毁动画并按技能攻击倍率扣除队伍 HP
     * @param enemy 攻击方敌人
     * @param skill 当前使用的技能
     * @param onComplete 攻击与扣血全部完成后的回调
     */
    static enemyAttack(enemy: Batter, skill: Module_Skill, onComplete?: Function): void {
        // 每次释放的伤害（releaseTimes 次，每次都是完整伤害）
        const damage = PADhelper.calcEnemyDamage(enemy, skill);
        // 释放次数（连击次数），至少 1 次
        const releaseTimes = Math.max(1, skill.releaseTimes || 1);
        const uiAvatar = enemy.avatar;
        // 元素动画起始位置：敌人行走图中心
        const startX = uiAvatar ? uiAvatar.x + uiAvatar.width * uiAvatar.scaleX / 2 : 0;
        const startY = uiAvatar ? uiAvatar.y + uiAvatar.height * uiAvatar.scaleY / 2 : 0;
        // 命中目标位置：队伍血条图片中心（battleUI 局部坐标）
        const hpImg = PADBattle.battleUI.PlayerHPimage;
        const hpCenterGlobal = hpImg.localToGlobal(new Point(hpImg.width / 2, hpImg.height / 2));
        const hpCenter = PADBattle.battleUI.globalToLocal(hpCenterGlobal);

        // 播放一次性特效动画：先监听 LOADED（异步加载完成）再设 id，
        // 加载完成后 addChild 到 battleUI 并定位到 (x,y)，播完自动销毁
        const playEffect = (aniID: number, x: number, y: number, isHit: boolean): void => {
            if (!aniID) return;
            const ani = new GCAnimation();
            ani.loop = false;
            ani.showHitEffect = isHit;
            ani.once(GCAnimation.PLAY_COMPLETED, null, () => { ani.dispose(); });
            ani.once(EventObject.LOADED, null, () => {
                if (ani.isDisposed) return;
                PADBattle.battleUI.addChild(ani);
                ani.pivotX = ani.width / 2;
                ani.pivotY = ani.height / 2;
                ani.x = x;
                ani.y = y;
                ani.visible = true;
            });
            ani.id = aniID;
            ani.gotoAndPlay();
        };

        // 累计最终总伤害（连击各次的钩子后伤害之和）
        let totalFinalDamage = 0;

        // 执行第 index 次释放（index 从 0 开始）
        const runRelease = (index: number): void => {
            // 全部释放完成：显示最终总伤害数字并触发完成回调
            if (index >= releaseTimes) {
                if (totalFinalDamage > 0) {
                    PADanim._showDamageText(Batter.players[0], totalFinalDamage, "#ff0000");
                }
                onComplete?.();
                return;
            }

            // 扣血并进入下一次释放
            const finish = (hpDuration: number): void => {
                if (damage > 0 && Batter.players.length > 0) {
                    // 队伍共享一条血条，以 players[0] 作为代表扣血（changeHP 返回钩子后最终伤害）
                    const finalChange = Batter.players[0].changeHP(enemy, -damage, hpDuration, skill.elementType1, () => { runRelease(index + 1); });
                    totalFinalDamage += Math.abs(finalChange);
                } else {
                    runRelease(index + 1);
                }
            };

            // 播放元素攻击动画：循环播放并从敌人位置飞向队伍血条中心，到达后销毁
            const playElementAni = (): void => {
                const element = GameData.getModuleData(2, skill.elementType1);
                const aniID = element ? element.ani : 0;
                if (!aniID) {
                    finish(500);
                    return;
                }
                const hitX = hpCenter.x - PADBattle.battleUI.PlayerHPimage.width;
                const hitY = hpCenter.y - PADBattle.battleUI.PlayerHPimage.height;
                const ani = new GCAnimation();
                ani.loop = true;
                ani.once(EventObject.LOADED, null, () => {
                    if (ani.isDisposed) return;
                    PADBattle.battleUI.addChild(ani);
                    ani.pivotX = ani.width / 2;
                    ani.pivotY = ani.height / 2;
                    ani.x = startX;
                    ani.y = startY;
                    ani.visible = true;
                    // 时长需在加载完成后读取（否则 totalFrame/fps 尚未就绪）
                    const moveDuration = Math.max(200, ani.totalFrame / (ani.fps || Config.ANIMATION_FPS) * 1000);
                    Tween.to(ani, { x: hitX, y: hitY }, moveDuration, null, Callback.New(() => {
                        ani.dispose();
                        // 命中特效：在销毁飞行动画时播放
                        playEffect(skill.hitAnimation, hitX, hitY, true);
                        finish(moveDuration);
                    }, null));
                });
                ani.id = aniID;
                ani.gotoAndPlay(1);
       

            };

            // 释放特效：落在释放者身上，与释放动作同时播放
            playEffect(skill.releaseAnimation, startX, startY, true);

            // 播放释放动作，播放完毕后播放元素动画
            if (uiAvatar) {
                const avatar = uiAvatar.avatar;
                if (avatar && avatar.hasActionID(skill.releaseActionID)) {
                    uiAvatar.offAll(Avatar.ACTION_PLAY_COMPLETED);
                    uiAvatar.once(Avatar.ACTION_PLAY_COMPLETED, null, () => {
                        avatar.currentFrame = 1;
                        uiAvatar.actionID = 1;
                        avatar.stop(1);
                        playElementAni();
                    });
                    avatar.currentFrame = 1;
                    uiAvatar.actionID = skill.releaseActionID;
                    avatar.play();
                    return;
                }
            }
            // 无行走图或没有释放动作：直接播放元素动画
            playElementAni();
        };

        runRelease(0);
    }

    /**
     * 敌人治疗：播放释放特效（releaseAnimation），在治疗目标上方飘治疗数字并回复生命值
     * @param enemy 释放治疗的敌人
     * @param skill 治疗技能
     * @param onComplete 治疗动画与回血全部完成后的回调
     */
    static enemyHeal(enemy: Batter, skill: Module_Skill, onComplete?: Function): void {
        // 治疗量（固定值）
        const healAmount = skill.heal || 0;
        // 治疗目标：isAll 治疗全体存活敌人，否则只治疗自己
        const targets: Batter[] = [];
        if (skill.isAll) {
            for (const e of Batter.enemys) {
                if (e.uihpSlider && e.uihpSlider.value > 0) targets.push(e);
            }
        } else {
            targets.push(enemy);
        }

        // 治疗数字颜色：固定绿色
        const healColor = "#00ff00";

        // 释放特效：落在释放者自己身上（一次性播放，播完自动销毁）
        if (skill.releaseAnimation) {
            const uiAvatar = enemy.avatar;
            const startX = uiAvatar ? uiAvatar.x + uiAvatar.width * uiAvatar.scaleX / 2 : 0;
            const startY = uiAvatar ? uiAvatar.y + uiAvatar.height * uiAvatar.scaleY / 2 : 0;
            const ani = new GCAnimation();
            ani.loop = false;
            ani.once(GCAnimation.PLAY_COMPLETED, null, () => { ani.dispose(); });
            ani.once(EventObject.LOADED, null, () => {
                if (ani.isDisposed) return;
                PADBattle.battleUI.addChild(ani);
                ani.pivotX = ani.width / 2;
                ani.pivotY = ani.height / 2;
                ani.x = startX;
                ani.y = startY;
                ani.visible = true;
            });
            ani.id = skill.releaseAnimation;
            ani.gotoAndPlay();
        }

        // 每个治疗目标回血（changeHP 返回钩子后最终治疗值，累加用于飘字）；全部完成后触发 onComplete
        let totalFinalHeal = 0;
        let pending = targets.length;
        const onTargetHealed = (): void => {
            if (--pending <= 0) onComplete?.();
        };
        for (const target of targets) {
            const finalHeal = target.changeHP(enemy, healAmount, 500, 0, onTargetHealed);
            totalFinalHeal += Math.abs(finalHeal);
        }

        // 总治疗量飘字（合并为一次，显示在释放者身上）
        if (totalFinalHeal > 0) {
            PADanim._showHealText(enemy, totalFinalHeal, healColor);
        }

        if (targets.length === 0) onComplete?.();
    }

    /**
     * 通用飘字：在指定位置显示文本，上飘淡出后销毁
     */
    private static _showFloatingText(text: string, x: number, y: number, color: string, onFadeComplete?: () => void): void {
        const t = new UIString();
        PADanim._applyTextTemplate(t);
        t.text = text;
        t.color = color;
        t.x = x;
        t.y = y;
        t.visible = true;
        PADBattle.battleUI.addChild(t);
        PADanim._activeFloatingCount++;
        Tween.to(t, { y: y - 30, opacity: 0 }, 800, null, Callback.New(() => {
            t.dispose();
            PADanim._activeFloatingCount--;
            if (PADanim._activeFloatingCount <= 0) {
                const cbs = PADanim._floatingWaitCallbacks;
                PADanim._floatingWaitCallbacks = [];
                for (const cb of cbs) cb();
            }
            onFadeComplete?.();
        }, null));
    }

    /**
     * 治疗飘字：在目标战斗者上方显示「+治疗量」并上飘淡出后销毁
     */
    private static _showHealText(target: Batter, amount: number, color: string, onFadeComplete?: () => void): void {
        if (amount <= 0) {
            onFadeComplete?.();
            return;
        }
        const av = target.avatar;
        const card = target.cardImage;
        let x = 0, y = 0;
        if (av) {
            x = av.x + av.width * av.scaleX / 2;
            y = av.y - 40;
        } else if (card) {
            x = card.x;
            y = card.y - 40;
        }
        PADanim._showFloatingText("+" + amount, x, y, color, onFadeComplete);
    }

    /**
     * 伤害飘字：在战斗者上方显示「-伤害值」并上飘淡出后销毁
     */
    private static _showDamageText(batter: Batter, amount: number, color: string): void {
        if (amount <= 0) return;
        const av = batter.avatar;
        const card = batter.cardImage;
        let x = 0, y = 0;
        if (av) {
            x = av.x + av.width * av.scaleX / 2;
            y = av.y - 40;
        } else if (card) {
            x = card.x;
            y = card.y - 40;
        }
        PADanim._showFloatingText("-" + amount, x, y, color);
    }

    /**
     * 累计玩家攻击对某敌人造成的伤害（按目标敌人分组）
     */
    static accumulateDamage(target: Batter, amount: number): void {
        if (amount <= 0) return;
        PADanim._pendingDamage.set(target, (PADanim._pendingDamage.get(target) || 0) + amount);
    }

    /**
     * 清空伤害累计（玩家攻击开始前调用）
     */
    static resetDamageAccumulator(): void {
        PADanim._pendingDamage.clear();
    }

    /**
     * 一次性显示每个敌人累计的总伤害数字（玩家攻击结束后调用）
     */
    static flushDamageNumbers(): void {
        PADanim._pendingDamage.forEach((total, target) => {
            PADanim._showDamageText(target, total, "#ff0000");
        });
        PADanim._pendingDamage.clear();
    }

    /**
     * 等待所有仍在淡出的飘字完成后执行回调（若当前无飘字则立即执行）。
     * 用于敌人行动前等待玩家回合的伤害数字淡出，避免与敌人治疗/攻击数字重叠。
     */
    static waitForFloatingDone(callback: () => void): void {
        if (PADanim._activeFloatingCount <= 0) {
            callback();
        } else {
            PADanim._floatingWaitCallbacks.push(callback);
        }
    }

    /**
     * 懒加载界面1004的text组件作为字体模板，并将其字体属性复制到目标文本组件
     */
    private static _applyTextTemplate(text: UIString): void {
        if (!this._textTemplate) {
            let ui1004: GUI_1004 = GameUI.load(1004) as GUI_1004;
            if (ui1004) this._textTemplate = ui1004.text;
        }
        const t = this._textTemplate;
        if (!t) return;
        text.width = t.width;
        text.height = t.height;
        text.fontSize = t.fontSize;
        text.bold = t.bold;
        text.italic = t.italic;
        text.smooth = t.smooth;
        text.leading = t.leading;
        text.letterSpacing = t.letterSpacing;
        text.font = t.font;
        text.wordWrap = t.wordWrap;
        text.overflow = t.overflow;
        text.align = t.align;
        text.valign = t.valign;
        text.shadowEnabled = t.shadowEnabled;
        text.shadowColor = t.shadowColor;
        text.shadowDx = t.shadowDx;
        text.shadowDy = t.shadowDy;
        text.stroke = t.stroke;
        text.strokeColor = t.strokeColor;
    }

    /**
     * 内部方法：执行队列中的下一个动画任务
     * @param batter 目标战斗者
     */
    private static _runNext(batter: Batter) {
        const data = this._animDataMap.get(batter);
        if (!data || data.queue.length === 0) {
            // 队列为空，标记动画结束
            if (data) data.isAnimating = false;
            return;
        }

        // 取出队首任务
        const task = data.queue.shift()!;
        const { change,duration, onComplete } = task;
        data.isAnimating = true;

        const slider = batter.uihpSlider;
        const intro = batter.uihpIntro;
        const currentHp = slider.value;
        const maxHp = slider.max;

        // 计算目标血量（限制在 [0, maxHp] 区间）
        let targetHp = Math.max(0, Math.min(currentHp + change, maxHp));
        const deltaTotal = targetHp - currentHp;

        // 若变化量为0，直接结束任务并触发下一个
        if (deltaTotal === 0) {
            onComplete?.();
            this._runNext(batter);
            return;
        }

        // 动画参数
        const frameInterval = 50; // 固定 50ms 一帧
        const totalFrames = Math.max(1, Math.floor(duration / frameInterval));
        let currentFrameHp = currentHp;
        let remainDelta = deltaTotal;

        // 清除旧定时器（防止重叠）
        if (data.ticker) {
            clearInterval(data.ticker);
            data.ticker = null;
        }

        // 生命值变化时，同时播放战斗者行走图的被攻击动作（ID 9）一次
        this._playHitAction(batter);

        // 启动新定时器
        data.ticker = setInterval(() => {
            let step: number;
            // 当剩余变化量不足一步时，直接跳到终点
            if (Math.abs(remainDelta) <= Math.ceil(Math.abs(deltaTotal) / totalFrames)) {
                step = remainDelta;
            } else {
                // 按整步前进（取整，保证最终准确到达）
                step = Math.sign(deltaTotal) * Math.ceil(Math.abs(deltaTotal) / totalFrames);
            }

            currentFrameHp += step;
            remainDelta -= step;

            // 更新 UI 文字（实时显示当前血量）
            intro.text = `${Math.round(currentFrameHp)}/${maxHp}`;

            // 到达终点
            if (remainDelta === 0) {
                slider.value = targetHp;
                // 敌人死亡（血量归零）时播放死亡动作（动作7）一次
                if (batter.camp === 0 && targetHp === 0 && currentHp > 0) {
                    this._playDeathAction(batter);
                }
                clearInterval(data.ticker!);
                data.ticker = null;
                // 调用本次动画结束回调
                onComplete?.();
                // 标记动画结束，并继续下一个任务
                data.isAnimating = false;
                this._runNext(batter);
                return;
            }

            // 更新进度条
            slider.value = currentFrameHp;
        }, frameInterval);
    }

    /**
     * 设置是否为最后一次受击（最后一次才播放被攻击动作，避免连续多次受击重复播放）
     * @param isLast 是否为最后一次受击
     */
    static setIsLastHit(isLast: boolean): void {
        PADanim._isLastHit = isLast;
    }

    /**
     * 播放战斗者行走图的被攻击动作（ID 9）一次，播放完毕后恢复到待机动作（ID 1）
     * 玩家（camp==1）没有行走图（只有卡图），不执行
     * @param batter 目标战斗者
     */
    private static _playHitAction(batter: Batter): void {
        // 非最后一次受击时跳过，避免连续多次受击重复播放被攻击动作
        if (!PADanim._isLastHit) return;
        // 玩家没有行走图，跳过
        if (!batter.avatar) return;
        const avatar = batter.avatar.avatar;
        // 行走图未就绪或没有动作ID 9（被攻击动作）则跳过
        if (!avatar || !avatar.hasActionID(9)) return;
        // 先移除旧的完成监听再注册新的，防止连续受击时监听残留
        batter.avatar.offAll(Avatar.ACTION_PLAY_COMPLETED);
        // 先注册 once 监听再切换动作，防止事件丢失；播放完毕恢复待机并停止播放（PAD 待机为静止状态）
        batter.avatar.once(Avatar.ACTION_PLAY_COMPLETED, null, () => {
            avatar.currentFrame = 1;
            batter.avatar.actionID = 1;
            avatar.stop(1);
        });
        // 重置播放进度（消除纪录的播放完成次数，确保完成事件触发），再切换到被攻击动作
        avatar.currentFrame = 1;
        batter.avatar.actionID = 9;
        // 显式开始播放（PAD 中待机为静止状态，必须调用 play 才会推进帧）
        avatar.play();
    }

    /**
     * 播放战斗者行走图的死亡动作（ID 7）一次，播放完毕后停留在最后一帧（死亡姿势）
     * 玩家（camp==1）没有行走图（只有卡图），不执行
     * @param batter 目标战斗者
     */
    private static _playDeathAction(batter: Batter): void {
        // 玩家没有行走图，跳过
        if (!batter.avatar) return;
        const avatar = batter.avatar.avatar;
        // 行走图未就绪或没有动作ID 7（死亡动作）则跳过
        if (!avatar || !avatar.hasActionID(7)) return;
        // 先移除旧的完成监听再注册新的，防止残留
        batter.avatar.offAll(Avatar.ACTION_PLAY_COMPLETED);
        // 死亡动作播放完毕后停留在最后一帧（死亡姿势），不恢复待机
        batter.avatar.once(Avatar.ACTION_PLAY_COMPLETED, null, () => {
            avatar.stop(avatar.totalFrame);
        });
        // 重置播放进度，切换到死亡动作并播放
        avatar.currentFrame = 1;
        batter.avatar.actionID = 7;
        avatar.play();
    }
}