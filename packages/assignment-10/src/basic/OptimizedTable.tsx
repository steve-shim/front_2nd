import React, { memo } from 'react';
import { Table, Tbody, Tr, Td, Button } from '@chakra-ui/react';

// 개별 행 컴포넌트
const MemoizedRow = memo(({ lecture, index, addSchedule }) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
    <Td width="80px">
      <Button size="sm" colorScheme="green" onClick={() => addSchedule(lecture)}>
        추가
      </Button>
    </Td>
  </Tr>
));

// 테이블 바디 컴포넌트
const MemoizedTableBody = memo(({ lectures, addSchedule }) => (
  <Tbody>
    {lectures.map((lecture, index) => (
      <MemoizedRow key={`${lecture.id}-${index}`} lecture={lecture} index={index} addSchedule={addSchedule} />
    ))}
  </Tbody>
));

// 메인 테이블 컴포넌트
const OptimizedTable = memo(({ visibleLectures, addSchedule }) => (
  <Table size="sm" variant="striped">
    <MemoizedTableBody lectures={visibleLectures} addSchedule={addSchedule} />
  </Table>
));

export default OptimizedTable;
