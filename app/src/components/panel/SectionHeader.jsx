function SectionHeader({
  title,
  description,
  containerClassName = 'page-header',
  titleClassName = 'page-title',
  descClassName = 'page-desc',
  rightSlot = null
}) {
  return (
    <div className={containerClassName}>
      <div>
        <h1 className={titleClassName}>{title}</h1>
        {description ? <p className={descClassName}>{description}</p> : null}
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </div>
  )
}

export default SectionHeader
