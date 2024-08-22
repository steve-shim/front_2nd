import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import { useScheduleContext } from './ScheduleContext.tsx';
import SearchDialog from './SearchDialog.tsx';
import { useState, memo } from 'react';
import { deepEquals } from './utils.ts';
import ScheduleDndProvider from './ScheduleDndProvider.tsx';

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = (targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  };

  const remove = (targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    });
  };

  const MemoScheduleTable = ({ tableId, schedules, index }: Props) => {
    console.log('MemotableId, schedules, index', tableId, schedules, index);
    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
              복제
            </Button>
            <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => remove(tableId)}>
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          key={`schedule-table-${index}`}
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={timeInfo => setSearchInfo({ tableId, ...timeInfo })}
          onDeleteButtonClick={({ day, time }) =>
            setSchedulesMap(prev => ({
              ...prev,
              [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time)),
            }))
          }
        />
      </Stack>
    );
  };

  const MemoScheduleTableTest = memo(MemoScheduleTable, (prevProps, nextProps) => {
    // 깊은 비교 로직 구현
    return (
      deepEquals(prevProps.tableId, nextProps.tableId) &&
      deepEquals(prevProps.schedules, nextProps.schedules) &&
      deepEquals(prevProps.index, nextProps.index)
    );
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleDndProvider>
            <MemoScheduleTableTest key={tableId} tableId={tableId} schedules={schedules} index={index} />
          </ScheduleDndProvider>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />
    </>
  );
};
