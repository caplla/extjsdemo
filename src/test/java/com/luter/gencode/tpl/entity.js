import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luter.base.entity.BaseEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "${java_table_name}")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@JsonIgnoreProperties(value = { "hibernateLazyInitializer" })
public class ${java_class_name} extends BaseEntity implements java.io.Serializable {
@Id
@GeneratedValue(generator = "uuid")
@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
@Column(name = "id", nullable = false)
#foreach( $elem in $b)
    #if($elem.TYPE_NAME=="INT")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private Integer $elem.COLUMN_NAME ;
    #elseif($elem.TYPE_NAME=="TINYINT UNSIGNED")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private Boolean $elem.COLUMN_NAME ;
    #elseif($elem.TYPE_NAME=="VARCHAR")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private String $elem.COLUMN_NAME ;
    #elseif($elem.TYPE_NAME=="DECIMAL")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private BigDecimal $elem.COLUMN_NAME ;
    #elseif($elem.TYPE_NAME=="TINYINT")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private Boolean $elem.COLUMN_NAME  ;
    #elseif($elem.TYPE_NAME=="FLOAT")
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private Float $elem.COLUMN_NAME  ;
    #else
    /**
    * @Fields $elem.COLUMN_NAME : $elem.REMARKS
    */
    private String $elem.COLUMN_NAME ;
    #end
#end

}
