import dayjs from 'dayjs'

interface LibCalSlot {
  start: string
  end: string
  itemId: number
  checksum: string
  className: string
}

interface LibCalResponse {
  slots: LibCalSlot[]
}

export async function checkAvailability(
  dateTime: string
): Promise<Map<number, boolean>> {
  const today = dateTime
  const tomorrow = dayjs(today).add(1, 'day').format('YYYY-MM-DD hh:mm:ss')

  console.log(today, tomorrow)

  const formData = new URLSearchParams({
    lid: '2986',
    gid: '0',
    eid: '-1',
    seat: '0',
    seatId: '0',
    zone: '0',
    start: dateTime,
    end: tomorrow,
    pageIndex: '0',
    pageSize: '18',
  })

  console.log(
    'Fetching LibCal availability for date:',
    today,
    ' ending ',
    tomorrow
  )

  const response = await fetch(
    'https://carletonu.libcal.com/spaces/availability/grid',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://carletonu.libcal.com/spaces?lid=2986&gid=0&c=0',
      },
      body: formData,
    }
  )

  const data: LibCalResponse = await response.json()

  console.log(data.slots[0])

  const availabilityMap = new Map<number, boolean>()

  console

  let x = false

  data.slots.forEach((slot) => {
    const slotStart = Date.parse(slot.start)
    const slotEnd = Date.parse(slot.end)

    if (slotStart <= Date.parse(dateTime) && Date.parse(dateTime) <= slotEnd) {
      //console.log("here!!")
      availabilityMap.set(slot.itemId, slot.className !== 's-lc-eq-checkout')
    }
  })

  console.log(availabilityMap)

  return availabilityMap
}
