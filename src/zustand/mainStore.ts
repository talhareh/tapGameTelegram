import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

export const useMainStore = create(
    devtools(
        combine(
            {
                access_token: '' as string ,
                user: {} as any ,
                todayTaps: 0 as number ,
                targetTaps: 100 as number ,
                overAllTapsByUser: 0 as number ,
                overAllTaps: 0 as number ,
                appLoaderText: '' as string ,
                appLoader: false as boolean ,
                
            },
            (set) => ({
                set,
                setAccessToken: (inc: string) => set({ access_token: inc }),
                setUser: (user: Object) => set({ user: user }),
                setTodayTaps: (todayTaps: number) => set({ todayTaps }),
                setTargetTaps: (targetTaps: number) => set({ targetTaps }),
                setOverAllTapsByUser: (overAllTapsByUser: number) => set({ overAllTapsByUser }),
                setOverAllTaps: (overAllTaps: number) => set({ overAllTaps }),
                setAppLoader: (inc: boolean) => set({ appLoader: inc }),
                setAppLoaderText: (inc: string) => set({ appLoaderText: inc }),
                reset: () =>
                    set({
                        access_token: '' as string,
                        todayTaps: 0 as number,
                        targetTaps: 0 as number,
                        overAllTapsByUser: 0 as number,
                        overAllTaps: 0 as number,
                        user: {} as any ,
                        appLoader: false as boolean,
                        appLoaderText: '' as string ,
                    })
            })
        ),
        { name: 'MainStore' }
    )
);
